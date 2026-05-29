const CloudSync = {
  isEnabled() {
    return Boolean(
      typeof SYNC_CONFIG !== "undefined" &&
        SYNC_CONFIG.enabled &&
        SYNC_CONFIG.url &&
        SYNC_CONFIG.anonKey,
    );
  },

  workspaceId() {
    return SYNC_CONFIG.workspaceId || "default";
  },

  headers(prefer) {
    const headers = {
      apikey: SYNC_CONFIG.anonKey,
      Authorization: `Bearer ${SYNC_CONFIG.anonKey}`,
      "Content-Type": "application/json",
    };
    if (prefer) headers.Prefer = prefer;
    return headers;
  },

  tableUrl() {
    return `${SYNC_CONFIG.url.replace(/\/$/, "")}/rest/v1/workspaces`;
  },

  async ping() {
    if (!this.isEnabled()) return false;
    try {
      const res = await fetch(`${this.tableUrl()}?select=id&limit=1`, { headers: this.headers() });
      return res.ok;
    } catch {
      return false;
    }
  },

  async fetchRow() {
    if (!this.isEnabled()) return null;
    const res = await fetch(`${this.tableUrl()}?id=eq.${encodeURIComponent(this.workspaceId())}&select=*`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`cloud_fetch_${res.status}`);
    const rows = await res.json();
    return rows[0] ?? null;
  },

  async upsertRow(payload) {
    if (!this.isEnabled()) return null;
    const updatedAt = new Date().toISOString();
    const existing = await this.fetchRow().catch(() => null);
    if (existing) {
      const res = await fetch(`${this.tableUrl()}?id=eq.${encodeURIComponent(this.workspaceId())}`, {
        method: "PATCH",
        headers: this.headers("return=representation"),
        body: JSON.stringify({ ...payload, updated_at: updatedAt }),
      });
      if (!res.ok) throw new Error(`cloud_patch_${res.status}`);
      const rows = await res.json();
      return rows[0]?.updated_at ?? updatedAt;
    }
    const res = await fetch(this.tableUrl(), {
      method: "POST",
      headers: this.headers("return=representation"),
      body: JSON.stringify({ id: this.workspaceId(), ...payload, updated_at: updatedAt }),
    });
    if (!res.ok) throw new Error(`cloud_post_${res.status}`);
    const rows = await res.json();
    return rows[0]?.updated_at ?? updatedAt;
  },

  async saveVerifier(verifier) {
    return this.upsertRow({ verifier });
  },

  async saveVaultEnvelope(envelope) {
    return this.upsertRow({ vault: envelope });
  },
};
