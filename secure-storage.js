const VAULT_KEY = "translation-intern-manager-vault";
const AUTH_VERIFIER_KEY = "translation-intern-manager-auth-verifier";
const AUTH_LOCKOUT_KEY = "translation-intern-manager-auth-lockout";
const LEGACY_STORAGE_KEY = "translation-intern-manager-data";
const LEGACY_PRODUCT_KEY = "translation-intern-manager-product-centers";
const LEGACY_LANGUAGE_KEY = "translation-intern-manager-languages";
const PBKDF2_ITERATIONS = 250000;
const MAX_AUTH_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function b64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function fromB64(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2Hash(password, salt, iterations = PBKDF2_ITERATIONS) {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    256,
  );
  return new Uint8Array(bits);
}

function readVerifierLocal() {
  try {
    const raw = localStorage.getItem(AUTH_VERIFIER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeVerifierLocal(verifier) {
  localStorage.setItem(AUTH_VERIFIER_KEY, JSON.stringify(verifier));
}

function readLockout() {
  try {
    const raw = localStorage.getItem(AUTH_LOCKOUT_KEY);
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function writeLockout(value) {
  localStorage.setItem(AUTH_LOCKOUT_KEY, JSON.stringify(value));
}

const SecureStorage = {
  _verifierCache: null,
  lastRemoteUpdatedAt: "",

  async getVerifier() {
    if (this._verifierCache) return this._verifierCache;
    if (typeof CloudSync !== "undefined" && CloudSync.isEnabled()) {
      const row = await CloudSync.fetchRow();
      if (row?.verifier) {
        this._verifierCache = row.verifier;
        writeVerifierLocal(row.verifier);
        return row.verifier;
      }
    }
    const local = readVerifierLocal();
    if (local) this._verifierCache = local;
    return local;
  },

  async hasVerifier() {
    return Boolean(await this.getVerifier());
  },

  hasVaultLocal() {
    return Boolean(localStorage.getItem(VAULT_KEY));
  },

  hasLegacyPlaintext() {
    return Boolean(localStorage.getItem(LEGACY_STORAGE_KEY));
  },

  getLockoutStatus() {
    const lockout = readLockout();
    if (lockout.lockedUntil && Date.now() < lockout.lockedUntil) {
      const minutes = Math.ceil((lockout.lockedUntil - Date.now()) / 60000);
      return { locked: true, minutes };
    }
    if (lockout.lockedUntil && Date.now() >= lockout.lockedUntil) {
      writeLockout({ attempts: 0, lockedUntil: 0 });
    }
    return { locked: false, minutes: 0 };
  },

  recordFailedAttempt() {
    const lockout = readLockout();
    const attempts = (lockout.attempts ?? 0) + 1;
    if (attempts >= MAX_AUTH_ATTEMPTS) {
      writeLockout({ attempts: 0, lockedUntil: Date.now() + LOCKOUT_MINUTES * 60 * 1000 });
      return { locked: true, minutes: LOCKOUT_MINUTES };
    }
    writeLockout({ attempts, lockedUntil: 0 });
    return { locked: false, remaining: MAX_AUTH_ATTEMPTS - attempts };
  },

  clearFailedAttempts() {
    writeLockout({ attempts: 0, lockedUntil: 0 });
  },

  async setupPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await pbkdf2Hash(password, salt);
    const verifier = {
      salt: b64(salt),
      hash: b64(hash),
      iterations: PBKDF2_ITERATIONS,
      v: 1,
    };
    this._verifierCache = verifier;
    writeVerifierLocal(verifier);
    if (typeof CloudSync !== "undefined" && CloudSync.isEnabled()) {
      await CloudSync.saveVerifier(verifier);
    }
  },

  async verifyPassword(password) {
    const verifier = await this.getVerifier();
    if (!verifier) return false;
    const salt = fromB64(verifier.salt);
    const hash = await pbkdf2Hash(password, salt, verifier.iterations ?? PBKDF2_ITERATIONS);
    return timingSafeEqual(hash, fromB64(verifier.hash));
  },

  async deriveKey(password) {
    const verifier = await this.getVerifier();
    if (!verifier) throw new Error("Verifier missing");
    const salt = fromB64(verifier.salt);
    const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: verifier.iterations ?? PBKDF2_ITERATIONS, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
  },

  async exportKeyMaterial(key) {
    const raw = await crypto.subtle.exportKey("raw", key);
    return b64(new Uint8Array(raw));
  },

  async importKeyMaterial(material) {
    return crypto.subtle.importKey("raw", fromB64(material), { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  },

  async encryptPayload(key, payload) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    return {
      v: 1,
      iv: b64(iv),
      data: b64(new Uint8Array(ciphertext)),
    };
  },

  async decryptPayload(key, envelope) {
    const iv = fromB64(envelope.iv);
    const data = fromB64(envelope.data);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decrypted));
  },

  readLegacyPayload() {
    try {
      const savedState = localStorage.getItem(LEGACY_STORAGE_KEY);
      const savedProductCenters = localStorage.getItem(LEGACY_PRODUCT_KEY);
      const savedLanguages = localStorage.getItem(LEGACY_LANGUAGE_KEY);
      if (!savedState && !savedProductCenters && !savedLanguages) return null;
      return {
        state: savedState ? JSON.parse(savedState) : null,
        productCenters: savedProductCenters ? JSON.parse(savedProductCenters) : null,
        languages: savedLanguages ? JSON.parse(savedLanguages) : null,
      };
    } catch {
      return null;
    }
  },

  clearLegacyPlaintext() {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(LEGACY_PRODUCT_KEY);
    localStorage.removeItem(LEGACY_LANGUAGE_KEY);
  },

  writeVaultLocal(envelope) {
    localStorage.setItem(VAULT_KEY, JSON.stringify(envelope));
    this.clearLegacyPlaintext();
  },

  async saveVault(key, payload) {
    const envelope = await this.encryptPayload(key, payload);
    this.writeVaultLocal(envelope);
    if (typeof CloudSync !== "undefined" && CloudSync.isEnabled()) {
      this.lastRemoteUpdatedAt = (await CloudSync.saveVaultEnvelope(envelope)) ?? this.lastRemoteUpdatedAt;
    }
  },

  async loadVault(key) {
    if (typeof CloudSync !== "undefined" && CloudSync.isEnabled()) {
      try {
        const row = await CloudSync.fetchRow();
        if (row?.vault) {
          this.lastRemoteUpdatedAt = row.updated_at ?? "";
          this.writeVaultLocal(row.vault);
          return await this.decryptPayload(key, row.vault);
        }
      } catch {
        /* fall back to local cache */
      }
    }
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return null;
    try {
      return await this.decryptPayload(key, JSON.parse(raw));
    } catch {
      return null;
    }
  },

  async fetchRemoteVault(key) {
    if (typeof CloudSync === "undefined" || !CloudSync.isEnabled()) return null;
    const row = await CloudSync.fetchRow();
    if (!row?.vault || row.updated_at === this.lastRemoteUpdatedAt) return null;
    this.lastRemoteUpdatedAt = row.updated_at ?? "";
    this.writeVaultLocal(row.vault);
    return this.decryptPayload(key, row.vault);
  },

  async migrateLegacyPlaintext(key, defaultPayload) {
    const legacy = this.readLegacyPayload();
    const payload = {
      state: legacy?.state ?? defaultPayload.state,
      productCenters: legacy?.productCenters ?? defaultPayload.productCenters,
      languages: legacy?.languages ?? defaultPayload.languages,
    };
    await this.saveVault(key, payload);
    return payload;
  },
};
