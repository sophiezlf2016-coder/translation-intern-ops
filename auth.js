const AUTH_STORAGE_KEY = "translation-intern-manager-auth";
const AUTH_SESSION_HOURS = 12;
const MIN_PASSWORD_LENGTH = 8;

const AUTH_CONFIG = {
  enabled: true,
  blockPublicHost: false,
};

function isCloudSyncEnabled() {
  return typeof CloudSync !== "undefined" && CloudSync.isEnabled();
}

function authSubtitle(isSetup) {
  if (isCloudSyncEnabled()) {
    return authText(isSetup ? "auth.setupSubtitle" : "auth.loginSubtitle");
  }
  return authText(isSetup ? "auth.setupSubtitle" : "auth.subtitle");
}

function authText(key, vars = {}) {
  const zh = {
    "auth.title": "Translation Intern Ops",
    "auth.subtitle": "内部访问验证",
    "auth.setupSubtitle": "首次使用请设置团队访问密码（所有成员共用）",
    "auth.loginSubtitle": "请输入团队访问密码",
    "auth.password": "访问密码",
    "auth.passwordPh": "请输入访问密码",
    "auth.confirmPassword": "确认密码",
    "auth.confirmPasswordPh": "请再次输入密码",
    "auth.submit": "进入系统",
    "auth.setupSubmit": "设置并进入",
    "auth.error": "密码错误，请重试。",
    "auth.setupMismatch": "两次输入的密码不一致。",
    "auth.setupTooShort": "密码至少 8 位，建议包含字母和数字。",
    "auth.locked": "尝试次数过多，请 {minutes} 分钟后再试。",
    "auth.blockedTitle": "仅限内网访问",
    "auth.cloudUnavailable": "云端同步未就绪，请检查 Supabase 配置。",
    "auth.logout": "退出",
  };
  const en = {
    "auth.title": "Translation Intern Ops",
    "auth.subtitle": "Internal access required",
    "auth.setupSubtitle": "Set a team access password (shared by all members)",
    "auth.loginSubtitle": "Enter the team access password",
    "auth.password": "Access password",
    "auth.passwordPh": "Enter access password",
    "auth.confirmPassword": "Confirm password",
    "auth.confirmPasswordPh": "Re-enter password",
    "auth.submit": "Enter",
    "auth.setupSubmit": "Set password & enter",
    "auth.error": "Incorrect password.",
    "auth.setupMismatch": "Passwords do not match.",
    "auth.setupTooShort": "Password must be at least 8 characters.",
    "auth.locked": "Too many attempts. Try again in {minutes} min.",
    "auth.blockedTitle": "Intranet access only",
    "auth.cloudUnavailable": "Cloud sync is unavailable. Check Supabase configuration.",
    "auth.logout": "Sign out",
  };
  const locale = typeof getUiLocale === "function" ? getUiLocale() : "zh";
  let text = (locale === "en" ? en : zh)[key] ?? key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function isPublicHost() {
  const host = window.location.hostname.toLowerCase();
  return /\.github\.io$/i.test(host) || host === "github.io";
}

function isPrivateHost() {
  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
  if (/\.local$/i.test(host)) return true;
  return false;
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.keyMaterial || !session?.expiresAt) return null;
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function writeSession(keyMaterial) {
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      keyMaterial,
      expiresAt: Date.now() + AUTH_SESSION_HOURS * 60 * 60 * 1000,
    }),
  );
}

function clearSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.__secureStorageKey = null;
}

function hideAppShell() {
  document.querySelector(".app-shell")?.classList.add("hidden");
}

function showAppShell() {
  document.querySelector(".app-shell")?.classList.remove("hidden");
}

function removeAuthGate() {
  document.getElementById("authGate")?.remove();
}

function renderBlockedGate() {
  hideAppShell();
  const gate = document.createElement("div");
  gate.id = "authGate";
  gate.className = "auth-gate";
  gate.innerHTML = `
    <div class="auth-card auth-card-blocked">
      <div class="auth-brand">译</div>
      <h1>${authText("auth.blockedTitle")}</h1>
      <p>${authText("auth.blockedDesc")}</p>
    </div>
  `;
  document.body.appendChild(gate);
}

function renderAuthGate(mode = "login") {
  hideAppShell();
  const lockout = SecureStorage.getLockoutStatus();
  const gate = document.createElement("div");
  gate.id = "authGate";
  gate.className = "auth-gate";
  const isSetup = mode === "setup";
  gate.innerHTML = `
    <form class="auth-card" id="authForm">
      <div class="auth-brand">译</div>
      <h1>${authText("auth.title")}</h1>
      <p class="auth-subtitle">${authSubtitle(isSetup)}</p>
      ${
        lockout.locked
          ? `<p class="auth-error">${authText("auth.locked", { minutes: lockout.minutes })}</p>`
          : `
        <label class="auth-field">
          <span>${authText("auth.password")}</span>
          <input type="password" name="password" autocomplete="${isSetup ? "new-password" : "current-password"}" placeholder="${authText("auth.passwordPh")}" required minlength="${MIN_PASSWORD_LENGTH}" />
        </label>
        ${
          isSetup
            ? `
        <label class="auth-field">
          <span>${authText("auth.confirmPassword")}</span>
          <input type="password" name="confirm" autocomplete="new-password" placeholder="${authText("auth.confirmPasswordPh")}" required minlength="${MIN_PASSWORD_LENGTH}" />
        </label>`
            : ""
        }
        <p class="auth-error hidden" id="authError"></p>
        <button type="submit" class="btn-save auth-submit">${authText(isSetup ? "auth.setupSubmit" : "auth.submit")}</button>
      `
      }
    </form>
  `;
  document.body.appendChild(gate);
  if (lockout.locked) return;

  gate.querySelector("#authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    const error = gate.querySelector("#authError");

    if (password.length < MIN_PASSWORD_LENGTH) {
      error.textContent = authText("auth.setupTooShort");
      error.classList.remove("hidden");
      return;
    }

    if (isSetup) {
      if (password !== confirm) {
        error.textContent = authText("auth.setupMismatch");
        error.classList.remove("hidden");
        return;
      }
      await SecureStorage.setupPassword(password);
      await completeLogin(password);
      return;
    }

    const valid = await SecureStorage.verifyPassword(password);
    if (!valid) {
      const result = SecureStorage.recordFailedAttempt();
      if (result.locked) {
        renderAuthGate("login");
        return;
      }
      error.textContent = authText("auth.error");
      error.classList.remove("hidden");
      return;
    }

    await completeLogin(password);
  });
}

async function completeLogin(password) {
  const key = await SecureStorage.deriveKey(password);
  const keyMaterial = await SecureStorage.exportKeyMaterial(key);
  writeSession(keyMaterial);
  window.__secureStorageKey = key;
  SecureStorage.clearFailedAttempts();
  removeAuthGate();
  showAppShell();
  mountLogoutButton();
  document.dispatchEvent(new CustomEvent("auth-ready", { detail: { key } }));
}

function mountLogoutButton() {
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar || document.getElementById("logoutBtn")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.id = "logoutBtn";
  button.className = "btn-secondary auth-logout-btn";
  button.textContent = authText("auth.logout");
  button.addEventListener("click", () => {
    clearSession();
    window.location.reload();
  });
  toolbar.insertBefore(button, toolbar.firstChild);
}

async function restoreAuthenticatedSession(session) {
  try {
    window.__secureStorageKey = await SecureStorage.importKeyMaterial(session.keyMaterial);
    showAppShell();
    mountLogoutButton();
    document.dispatchEvent(new CustomEvent("auth-ready", { detail: { key: window.__secureStorageKey } }));
  } catch {
    clearSession();
    const hasVerifier = await SecureStorage.hasVerifier();
    renderAuthGate(hasVerifier ? "login" : "setup");
  }
}

async function initAccessGate() {
  if (!AUTH_CONFIG.enabled) {
    showAppShell();
    document.dispatchEvent(new Event("auth-ready"));
    return;
  }

  if (AUTH_CONFIG.blockPublicHost && (isPublicHost() || !isPrivateHost())) {
    renderBlockedGate();
    return;
  }

  if (isCloudSyncEnabled()) {
    const online = await CloudSync.ping();
    if (!online) {
      hideAppShell();
      const gate = document.createElement("div");
      gate.id = "authGate";
      gate.className = "auth-gate";
      gate.innerHTML = `
        <div class="auth-card auth-card-blocked">
          <div class="auth-brand">译</div>
          <h1>${authText("auth.title")}</h1>
          <p>${authText("auth.cloudUnavailable")}</p>
        </div>
      `;
      document.body.appendChild(gate);
      return;
    }
  }

  const session = readSession();
  if (session) {
    await restoreAuthenticatedSession(session);
    return;
  }

  const hasVerifier = await SecureStorage.hasVerifier();
  renderAuthGate(hasVerifier ? "login" : "setup");
}

initAccessGate();
