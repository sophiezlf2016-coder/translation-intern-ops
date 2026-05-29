const AUTH_STORAGE_KEY = "translation-intern-manager-auth";
const AUTH_SESSION_HOURS = 12;

const AUTH_CONFIG = {
  enabled: true,
  blockPublicHost: true,
  // Default password: InternOps2026 — change hash after editing password
  passwordHash: "af1ce16184b0c3e7650735a8f26a153bfbd1cba9227cb073184985a3153d76fc",
};

function authText(key) {
  const zh = {
    "auth.title": "Translation Intern Ops",
    "auth.subtitle": "内部访问验证",
    "auth.password": "访问密码",
    "auth.passwordPh": "请输入访问密码",
    "auth.submit": "进入系统",
    "auth.error": "密码错误，请重试。",
    "auth.blockedTitle": "仅限内网访问",
    "auth.blockedDesc": "公网地址已关闭。请通过公司内网或 VPN 访问内部部署地址。",
    "auth.logout": "退出",
  };
  const en = {
    "auth.title": "Translation Intern Ops",
    "auth.subtitle": "Internal access required",
    "auth.password": "Access password",
    "auth.passwordPh": "Enter access password",
    "auth.submit": "Enter",
    "auth.error": "Incorrect password.",
    "auth.blockedTitle": "Intranet access only",
    "auth.blockedDesc": "Public access is disabled. Use the internal deployment URL via company network or VPN.",
    "auth.logout": "Sign out",
  };
  const locale = typeof getUiLocale === "function" ? getUiLocale() : "zh";
  return (locale === "en" ? en : zh)[key] ?? key;
}

function isPublicHost() {
  const host = window.location.hostname.toLowerCase();
  if (/\.github\.io$/i.test(host)) return true;
  if (host === "github.io") return true;
  return false;
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

async function hashPassword(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.token || !session?.expiresAt) return null;
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function writeSession(token) {
  sessionStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
      expiresAt: Date.now() + AUTH_SESSION_HOURS * 60 * 60 * 1000,
    }),
  );
}

function clearSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
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

function renderLoginGate() {
  hideAppShell();
  const gate = document.createElement("div");
  gate.id = "authGate";
  gate.className = "auth-gate";
  gate.innerHTML = `
    <form class="auth-card" id="authForm">
      <div class="auth-brand">译</div>
      <h1>${authText("auth.title")}</h1>
      <p class="auth-subtitle">${authText("auth.subtitle")}</p>
      <label class="auth-field">
        <span>${authText("auth.password")}</span>
        <input type="password" name="password" autocomplete="current-password" placeholder="${authText("auth.passwordPh")}" required />
      </label>
      <p class="auth-error hidden" id="authError">${authText("auth.error")}</p>
      <button type="submit" class="btn-save auth-submit">${authText("auth.submit")}</button>
    </form>
  `;
  document.body.appendChild(gate);

  gate.querySelector("#authForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    const hash = await hashPassword(String(password ?? ""));
    const error = gate.querySelector("#authError");
    if (hash !== AUTH_CONFIG.passwordHash) {
      error?.classList.remove("hidden");
      return;
    }
    writeSession(hash);
    removeAuthGate();
    showAppShell();
    mountLogoutButton();
    document.dispatchEvent(new Event("auth-ready"));
  });
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

function initAccessGate() {
  if (!AUTH_CONFIG.enabled) {
    showAppShell();
    document.dispatchEvent(new Event("auth-ready"));
    return;
  }

  if (AUTH_CONFIG.blockPublicHost && isPublicHost()) {
    renderBlockedGate();
    return;
  }

  if (!isPrivateHost() && AUTH_CONFIG.blockPublicHost) {
    renderBlockedGate();
    return;
  }

  if (readSession()) {
    showAppShell();
    mountLogoutButton();
    document.dispatchEvent(new Event("auth-ready"));
    return;
  }

  renderLoginGate();
}

initAccessGate();
