const defaultLanguages = [
  { id: "en", label: "英语", pair: "中英" },
  { id: "ja", label: "日语", pair: "中日" },
  { id: "ko", label: "韩语", pair: "中韩" },
  { id: "fr", label: "法语", pair: "中法" },
];

const defaultProductCenters = ["官网", "帮助中心", "活动页", "商家后台", "品牌官网", "开发者平台"];

let languages = cloneData(defaultLanguages);
let productCenters = [...defaultProductCenters];

let activeView = "dashboard";
let activeLanguage = "en";
let activeKnowledgeLanguage = "en";
let editingInternId = null;
let editingKnowledge = null;
let editingProductCenterIndex = null;
let editingTaskId = null;
let editingGuideId = null;
const collapsedMonths = new Set();
const collapsedKnowledgeCategories = new Set();
const collapsedGuideIds = new Set();
const expandedTaskDescriptions = new Set();

const defaultState = {
  interns: [
    { id: 1, name: "林雨晴", language: "en", workDays: "周一至周五", score: 91, load: 4 },
    { id: 2, name: "周以安", language: "ja", workDays: "周二至周六", score: 87, load: 3 },
    { id: 3, name: "许知远", language: "ko", workDays: "周一、周三、周五", score: 94, load: 5 },
    { id: 4, name: "陈嘉宁", language: "fr", workDays: "周一至周四", score: 85, load: 2 },
    { id: 5, name: "沈沐", language: "en", workDays: "周一至周五", score: 96, load: 5 },
  ],
  tasks: [
    { id: 101, title: "新品发布稿本地化", product: "官网", language: "en", status: "todo", assignee: "林雨晴", contact: "王产品", progress: 8, priority: "高", words: 2600, createdAt: "05-27", description: "保留品牌语气，重点检查功能名与CTA一致性。" },
    { id: 102, title: "帮助中心批量更新", product: "帮助中心", language: "en", status: "doing", assignee: "林雨晴", contact: "李运营", progress: 56, priority: "中", words: 4200, createdAt: "05-26", description: "按维护说明统一第二人称表达。" },
    { id: 103, title: "手游活动公告", product: "活动页", language: "ja", status: "review", assignee: "周以安", contact: "赵市场", progress: 82, priority: "高", words: 1800, createdAt: "05-25", description: "核对限定道具名称，避免直译。" },
    { id: 104, title: "跨境店铺FAQ", product: "商家后台", language: "ko", status: "doing", assignee: "许知远", contact: "孙商家", progress: 62, priority: "中", words: 3100, createdAt: "05-24", description: "注意敬语层级和售后政策表述。" },
    { id: 105, title: "品牌故事长文", product: "品牌官网", language: "fr", status: "todo", assignee: "陈嘉宁", contact: "周品牌", progress: 0, priority: "低", words: 2200, createdAt: "05-23", description: "更偏编辑改写，避免过度技术化。" },
    { id: 106, title: "开发者文档校对", product: "开发者平台", language: "en", status: "done", assignee: "沈沐", contact: "吴技术", progress: 100, priority: "高", words: 5300, createdAt: "05-22", description: "已完成术语抽检和链接检查。" },
  ],
  guides: [
    {
      id: 501,
      title: "入职第一周清单",
      content: "1. 熟悉产品中心命名规范\n2. 完成一条试译任务\n3. 阅读本地化偏好与禁忌条目",
      type: "text",
      fileName: "",
      createdAt: "05-20",
      pinned: false,
    },
  ],
  knowledgeLanguageIds: ["en", "ja", "ko", "fr"],
  maintenance: [
    { id: 201, language: "en", title: "节日促销表达", owner: "偏好", status: "文化偏好", due: "英语", note: "面向北美用户时，节日促销可直接突出折扣和限时利益点。", submitter: "林雨晴" },
    { id: 202, language: "ja", title: "客服语气", owner: "偏好", status: "礼貌表达", due: "日语", note: "日语客服文案应优先使用缓和表达，避免过于直接的命令语气。", submitter: "周以安" },
    { id: 203, language: "ko", title: "活动参与引导", owner: "偏好", status: "用户期待", due: "韩语", note: "韩语活动页适合清楚列出参与步骤和奖励领取条件。", submitter: "许知远" },
  ],
  resourceStatus: [
    { id: 301, language: "en", name: "标题大小写", count: 100, updated: 100, status: "格式", submitter: "沈沐" },
    { id: 302, language: "ja", name: "全角半角", count: 100, updated: 100, status: "标点", submitter: "周以安" },
    { id: 303, language: "ko", name: "数字与单位", count: 100, updated: 100, status: "排版", submitter: "许知远" },
  ],
  updateLog: [
    { id: 401, language: "ko", date: "禁用", item: "过度夸大效果", detail: "避免使用绝对化功效承诺，尤其在健康、金融相关内容中。", submitter: "许知远" },
    { id: 402, language: "en", date: "敏感", item: "隐私相关措辞", detail: "不要暗示系统会读取用户私人内容，需明确授权和用途。", submitter: "林雨晴" },
    { id: 403, language: "fr", date: "禁用", item: "非正式称呼滥用", detail: "品牌正式页面避免随意使用过度亲密的第二人称语气。", submitter: "陈嘉宁" },
  ],
};

let state = cloneData(defaultState);

const statusMap = {
  todo: "待分配",
  doing: "进行中",
  review: "复核中",
  done: "已完成",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugifyLanguage(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "")
    .slice(0, 24);
}

function languageAliasId(value) {
  const token = String(value ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (!token) return "";
  const aliasMap = {
    en: "en",
    english: "en",
    "英语": "en",
    "英語": "en",
    "英文": "en",
    ja: "ja",
    japanese: "ja",
    "日语": "ja",
    "日語": "ja",
    "日文": "ja",
    "日本語": "ja",
    ko: "ko",
    korean: "ko",
    "韩语": "ko",
    "韓語": "ko",
    "韩文": "ko",
    "韓文": "ko",
    fr: "fr",
    french: "fr",
    "法语": "fr",
    "法語": "fr",
    "法文": "fr",
  };
  return aliasMap[token] ?? "";
}

function normalizeLanguageId(value) {
  const alias = languageAliasId(value);
  if (alias) return alias;
  const text = String(value ?? "").trim();
  if (!text) return "";
  const lowered = text.toLowerCase();
  const existing = languages.find((item) => {
    const id = String(item.id ?? "").trim().toLowerCase();
    const label = String(item.label ?? "").trim().toLowerCase();
    const display = String(displayLanguageLabel(item) ?? "").trim().toLowerCase();
    return id === lowered || label === lowered || display === lowered;
  });
  return existing?.id ?? "";
}

function applyVaultPayload(payload) {
  if (!payload) return;
  const savedState = payload.state ?? {};
  state.interns = Array.isArray(savedState.interns) ? savedState.interns : cloneData(defaultState.interns);
  state.tasks = Array.isArray(savedState.tasks) ? savedState.tasks : cloneData(defaultState.tasks);
  state.maintenance = Array.isArray(savedState.maintenance) ? savedState.maintenance : cloneData(defaultState.maintenance);
  state.resourceStatus = Array.isArray(savedState.resourceStatus) ? savedState.resourceStatus : cloneData(defaultState.resourceStatus);
  state.updateLog = Array.isArray(savedState.updateLog) ? savedState.updateLog : cloneData(defaultState.updateLog);
  state.guides = Array.isArray(savedState.guides) ? savedState.guides : cloneData(defaultState.guides);
  state.knowledgeLanguageIds = Array.isArray(savedState.knowledgeLanguageIds)
    ? savedState.knowledgeLanguageIds
    : cloneData(defaultState.knowledgeLanguageIds);
  if (Array.isArray(payload.productCenters) && payload.productCenters.length) {
    productCenters = payload.productCenters;
  }
  if (Array.isArray(payload.languages) && payload.languages.length) {
    languages = payload.languages;
  }
}

function defaultPayload() {
  return {
    state: cloneData(defaultState),
    productCenters: [...defaultProductCenters],
    languages: cloneData(defaultLanguages),
  };
}

async function bootstrapSecureData(key) {
  const payload = await SecureStorage.loadVault(key);
  if (payload) {
    applyVaultPayload(payload);
    await seedCloudIfEmpty(key);
    return;
  }

  if (SecureStorage.hasLegacyPlaintext()) {
    applyVaultPayload(await SecureStorage.migrateLegacyPlaintext(key, defaultPayload()));
    await seedCloudIfEmpty(key);
    return;
  }

  const hasStoredData =
    SecureStorage.hasBackup() ||
    SecureStorage.hasVaultLocal() ||
    SecureStorage.hasLegacyPlaintext() ||
    (await SecureStorage.hasRemoteVault());
  if (hasStoredData) {
    showToast(t("toast.loadFailed"));
    sessionStorage.removeItem("translation-intern-manager-auth");
    window.__secureStorageKey = null;
    setTimeout(() => window.location.reload(), 1500);
    return;
  }

  applyVaultPayload(defaultPayload());
  await SecureStorage.saveVault(key, { state, productCenters, languages });
  await seedCloudIfEmpty(key);
}

async function seedCloudIfEmpty(key) {
  if (typeof CloudSync === "undefined" || !CloudSync.isEnabled()) return;
  try {
    const row = (await CloudSync.fetchRow()) ?? {};
    if (!row.verifier) {
      const verifier = await SecureStorage.getVerifier();
      if (verifier) await CloudSync.saveVerifier(verifier);
    }
    if (!row.vault) {
      await SecureStorage.saveVault(key, { state, productCenters, languages });
    }
  } catch {
    updateSyncStatus("error");
  }
}

let syncPollTimer = null;
let lastSyncToastAt = 0;

async function refreshFromCloud(key, { silent = false } = {}) {
  if (typeof CloudSync === "undefined" || !CloudSync.isEnabled()) return false;
  try {
    const payload = await SecureStorage.fetchRemoteVault(key);
    if (!payload) return false;
    applyVaultPayload(payload);
    migrateState();
    renderAll();
    if (!silent && Date.now() - lastSyncToastAt > 8000) {
      lastSyncToastAt = Date.now();
      showToast(t("toast.syncUpdated"));
    }
    updateSyncStatus("online");
    return true;
  } catch {
    updateSyncStatus("error");
    return false;
  }
}

function startCloudPolling(key) {
  if (typeof CloudSync === "undefined" || !CloudSync.isEnabled()) return;
  clearInterval(syncPollTimer);
  syncPollTimer = setInterval(() => {
    void refreshFromCloud(key, { silent: true });
  }, 8000);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible") {
        void refreshFromCloud(key, { silent: true });
      }
    },
    { passive: true },
  );
}

function mountSyncStatus() {
  void updateSyncStatus();
  updateSyncBanner();
}

function updateSyncBanner() {
  const banner = document.getElementById("syncBanner");
  const setupBtn = document.getElementById("openSyncSetupBtn");
  if (!banner) return;
  const enabled = typeof CloudSync !== "undefined" && CloudSync.isEnabled();
  banner.classList.toggle("hidden", enabled);
  setupBtn?.classList.toggle("hidden", enabled);
  const text = document.getElementById("syncBannerText");
  if (text) text.textContent = t("sync.banner.text");
}

function openSyncSetupModal() {
  const modal = document.getElementById("syncSetupModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  const override = loadSyncOverride();
  const form = document.getElementById("syncSetupForm");
  const config = typeof getSyncConfig === "function" ? getSyncConfig() : null;
  if (form) {
    form.elements.url.value = override?.url || config?.url || "";
    form.elements.anonKey.value = override?.anonKey || config?.anonKey || "";
  }
  const codeBox = document.getElementById("syncSetupCodeBox");
  const codeField = document.getElementById("syncSetupCode");
  if (override?.url && override?.anonKey && codeBox && codeField) {
    codeBox.classList.remove("hidden");
    codeField.value = encodeSyncSetupCode(override);
  } else if (codeBox) {
    codeBox.classList.add("hidden");
  }
}

function closeSyncSetupModal() {
  document.getElementById("syncSetupModal")?.classList.add("hidden");
}

async function handleSyncSetupSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const code = String(form.elements.code.value ?? "").trim();
  const url = String(form.elements.url.value ?? "").trim();
  const anonKey = String(form.elements.anonKey.value ?? "").trim();
  let config;
  try {
    if (code) {
      config = decodeSyncSetupCode(code);
    } else if (url && anonKey) {
      config = { url, anonKey, workspaceId: "translation-intern-ops" };
    } else {
      showToast(t("toast.syncSetupRequired"));
      return;
    }
  } catch {
    showToast(t("toast.syncSetupInvalid"));
    return;
  }
  saveSyncOverride(config);
  const online = await CloudSync.ping();
  if (!online) {
    clearSyncOverride();
    showToast(t("toast.syncSetupFailed"));
    return;
  }
  const codeBox = document.getElementById("syncSetupCodeBox");
  const codeField = document.getElementById("syncSetupCode");
  if (codeBox && codeField) {
    codeBox.classList.remove("hidden");
    codeField.value = encodeSyncSetupCode(config);
  }
  showToast(t("toast.syncSetupOk"));
  setTimeout(() => window.location.reload(), 800);
}

async function updateSyncStatus(forcedState) {
  const badge = document.getElementById("syncStatus");
  const setupBtn = document.getElementById("openSyncSetupBtn");
  if (!badge) return;
  if (typeof CloudSync === "undefined" || !CloudSync.isEnabled()) {
    badge.className = "sync-status sync-status-off";
    badge.textContent = t("sync.label.off");
    badge.title = t("sync.status.off");
    setupBtn?.classList.remove("hidden");
    updateSyncBanner();
    return;
  }
  setupBtn?.classList.add("hidden");
  updateSyncBanner();
  if (forcedState === "error") {
    badge.className = "sync-status sync-status-error";
    badge.textContent = t("sync.label.error");
    badge.title = t("sync.status.error");
    return;
  }
  if (forcedState === "online") {
    badge.className = "sync-status sync-status-on";
    badge.textContent = t("sync.label.on");
    badge.title = t("sync.status.on");
    return;
  }
  const online = await CloudSync.ping();
  if (online) {
    badge.className = "sync-status sync-status-on";
    badge.textContent = t("sync.label.on");
    badge.title = t("sync.status.on");
  } else {
    badge.className = "sync-status sync-status-error";
    badge.textContent = t("sync.label.error");
    badge.title = t("sync.status.error");
  }
}

let persistTimer = null;
let persistInFlight = null;

async function persistDataNow() {
  const key = window.__secureStorageKey;
  if (!key || typeof SecureStorage === "undefined") return;
  clearTimeout(persistTimer);
  persistTimer = null;
  try {
    persistInFlight = SecureStorage.saveVault(key, { state, productCenters, languages });
    const result = await persistInFlight;
    if (typeof CloudSync !== "undefined" && CloudSync.isEnabled()) {
      if (result.cloudOk) {
        updateSyncStatus("online");
      } else {
        updateSyncStatus("error");
        showToast(t("toast.syncFailed"));
      }
    }
  } catch {
    showToast(t("toast.saveFailed"));
  } finally {
    persistInFlight = null;
  }
}

function persistData() {
  void persistDataNow();
}

function flushPersistData() {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
    void persistDataNow();
    return;
  }
  if (persistInFlight) return;
}

window.addEventListener("pagehide", flushPersistData);
window.addEventListener("beforeunload", flushPersistData);

function languageName(id) {
  const lang = languages.find((item) => item.id === id);
  if (!lang) return id;
  return displayLanguageLabel(lang);
}

function languageInputValue(id) {
  return languageName(id);
}

function normalizeWorkDays(value) {
  const text = String(value ?? "").trim();
  return text || "未设置";
}

function displayWorkDays(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "未设置") return t("common.notSet");
  return text;
}

function displayDeadline(value) {
  return displayTaskDate(value);
}

function displayTaskDate(value) {
  if (!value || value === "待定") return t("common.pending");
  const text = String(value).trim();
  if (!text) return t("common.pending");

  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(text)) {
    const [year, month, day] = text.replaceAll("/", "-").split("-");
    return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
  }

  if (/^\d{1,2}-\d{1,2}$/.test(text)) {
    const [month, day] = text.split("-");
    return `${new Date().getFullYear()}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
  }

  return text.replaceAll("-", "/");
}

function migrateInternWorkDays(intern) {
  if (intern.workDays) {
    intern.workDays = normalizeWorkDays(intern.workDays);
    return;
  }
  const weekPattern = /周|星期|周一|周二|周三|周四|周五|周六|周日|逢/;
  const freq = intern.workFrequency;
  const start = intern.workStart;
  if (freq && weekPattern.test(String(freq))) intern.workDays = String(freq).trim();
  else if (start && weekPattern.test(String(start))) intern.workDays = String(start).trim();
  else if (freq) intern.workDays = String(freq).trim();
  else intern.workDays = "未设置";
}

function closeTaskPanels() {
  $("#importPanel")?.classList.add("hidden");
  $("#productCenterPanel")?.classList.add("hidden");
}

function toggleTaskPanel(panelId, closeOthers = true) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const willOpen = panel.classList.contains("hidden");
  if (closeOthers && willOpen) closeTaskPanels();
  panel.classList.toggle("hidden");
}

function allKnowledgeEntries() {
  return [...state.maintenance, ...state.resourceStatus, ...state.updateLog];
}

function collectKnowledgeLanguageIds() {
  const ids = new Set(state.knowledgeLanguageIds ?? []);
  allKnowledgeEntries().forEach((item) => {
    if (item.language) ids.add(item.language);
  });
  return [...ids];
}

function getKnowledgeLanguages() {
  const ids = collectKnowledgeLanguageIds();
  return ids
    .map((id) => languages.find((item) => item.id === id) ?? { id, label: id, pair: id })
    .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
}

function syncKnowledgeLanguages() {
  const ids = collectKnowledgeLanguageIds();
  if (!state.knowledgeLanguageIds) state.knowledgeLanguageIds = [];
  ids.forEach((id) => {
    if (!state.knowledgeLanguageIds.includes(id)) state.knowledgeLanguageIds.push(id);
  });
  if (!ids.includes(activeKnowledgeLanguage)) {
    activeKnowledgeLanguage = ids[0] ?? languages[0]?.id ?? "en";
  }
}

function addKnowledgeLanguage(label) {
  const languageId = ensureLanguage(label);
  if (!languageId) return "";
  if (!state.knowledgeLanguageIds.includes(languageId)) {
    state.knowledgeLanguageIds.push(languageId);
  }
  activeKnowledgeLanguage = languageId;
  return languageId;
}

function getLinkedLanguages() {
  const ids = [];
  const pushId = (id) => {
    if (!id || ids.includes(id)) return;
    ids.push(id);
  };
  state.interns.forEach((intern) => pushId(intern.language));
  state.tasks.forEach((task) => pushId(task.language));
  const linked = ids.map((id) => languages.find((item) => item.id === id)).filter(Boolean);
  return linked.length ? linked : languages;
}

function syncLanguagesFromInterns() {
  state.interns.forEach((intern) => {
    if (!intern.language) return;
    if (!languages.some((item) => item.id === intern.language)) {
      languages.push({ id: intern.language, label: intern.language, pair: intern.language });
    }
  });
  const linked = getLinkedLanguages();
  if (!linked.some((item) => item.id === activeLanguage)) {
    activeLanguage = linked[0]?.id ?? languages[0]?.id ?? activeLanguage;
  }
}

function applyInternLanguageChange(intern, languageId) {
  const previousLanguage = intern.language;
  intern.language = languageId;
  state.tasks.forEach((task) => {
    if (task.assignee === intern.name) task.language = languageId;
  });
  syncLanguagesFromInterns();
  if (!getLinkedLanguages().some((item) => item.id === activeLanguage)) {
    activeLanguage = languageId;
  }
  return previousLanguage;
}

function ensureLanguage(value) {
  const label = String(value ?? "").trim();
  if (!label) return "";
  const normalizedId = normalizeLanguageId(label);
  if (normalizedId) return normalizedId;
  const baseId = slugifyLanguage(label) || `lang-${Date.now()}`;
  let nextId = baseId;
  let counter = 1;
  while (languages.some((item) => item.id === nextId)) {
    counter += 1;
    nextId = `${baseId}-${counter}`;
  }
  languages.push({ id: nextId, label, pair: label });
  return nextId;
}

function normalizeLanguageData() {
  const presetIds = new Set(defaultLanguages.map((item) => item.id));
  const mergedLanguages = [...defaultLanguages.map((item) => ({ ...item }))];
  const existingIds = new Set(mergedLanguages.map((item) => item.id));

  languages.forEach((item) => {
    const normalizedId = normalizeLanguageId(item.id) || normalizeLanguageId(item.label) || item.id;
    if (presetIds.has(normalizedId) || existingIds.has(normalizedId)) return;
    mergedLanguages.push({
      id: normalizedId,
      label: item.label || normalizedId,
      pair: item.pair || item.label || normalizedId,
    });
    existingIds.add(normalizedId);
  });
  languages = mergedLanguages;

  const normalizeOrCreate = (value) => {
    const normalized = normalizeLanguageId(value);
    if (normalized) return normalized;
    return ensureLanguage(value);
  };

  state.interns.forEach((intern) => {
    if (!intern.language) return;
    intern.language = normalizeOrCreate(intern.language);
  });

  state.tasks.forEach((task) => {
    if (!task.language) return;
    task.language = normalizeOrCreate(task.language);
  });

  allKnowledgeEntries().forEach((item) => {
    if (!item.language) return;
    item.language = normalizeOrCreate(item.language);
  });

  state.knowledgeLanguageIds = [...new Set((state.knowledgeLanguageIds ?? []).map(normalizeOrCreate).filter(Boolean))];
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function todayLabel() {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function dateToLabel(value) {
  if (!value) return "待定";
  if (/^\d{1,2}-\d{1,2}$/.test(value)) {
    const [month, day] = value.split("-");
    return `${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  const [, month, day] = value.split("-");
  return month && day ? `${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "待定";
}

function normalizeCreatedAt(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (!text) return "";
  if (/^\d{1,2}-\d{1,2}$/.test(text)) return dateToLabel(text);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return dateToLabel(text);
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(text)) return dateToLabel(text.replaceAll("/", "-"));
  if (/^\d{4}-\d{2}$/.test(text)) return `${text.slice(5, 7)}-01`;
  if (/^\d{4}\/\d{2}$/.test(text)) return `${text.slice(5, 7)}-01`;
  if (/^\d{1,2}月$/.test(text)) return `${text.replace("月", "").padStart(2, "0")}-01`;
  if (/^\d{1,2}$/.test(text)) return `${text.padStart(2, "0")}-01`;
  return "";
}

function internsForLanguage(language) {
  return state.interns.filter((intern) => intern.language === language);
}

function assigneeOptions(task) {
  const interns = internsForLanguage(task.language);
  if (!interns.length) return `<option value="">${t("tasks.noAssignee")}</option>`;
  return interns
    .map((intern) => `<option value="${intern.name}" ${intern.name === task.assignee ? "selected" : ""}>${intern.name}</option>`)
    .join("");
}

function productCenterOptions(selected = productCenters[0]) {
  return productCenters
    .map((product) => `<option value="${product}" ${product === selected ? "selected" : ""}>${product}</option>`)
    .join("");
}

function labelToDateInput(value) {
  if (!value || value === "待定") return "";
  const [month, day] = value.split("-");
  const year = new Date().getFullYear();
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function openTaskForm(task = null) {
  const modal = $("#taskFormModal");
  const form = $("#taskForm");
  $("#taskFormTitle").textContent = task ? t("taskForm.edit") : t("taskForm.create");
  modal.classList.remove("hidden");
  form.elements.title.value = task?.title ?? "";
  form.elements.description.value = task?.description ?? "";
  form.elements.product.value = task?.product ?? productCenters[0];
  form.elements.contact.value = task?.contact ?? "";
  form.elements.deadline.value = labelToDateInput(task?.deadline);
  form.elements.priority.value = task?.priority ?? "中";
  updateLocalizedSelects();
}

function closeTaskForm() {
  editingTaskId = null;
  $("#taskForm").reset();
  $("#taskFormModal").classList.add("hidden");
}

function renderProductCenters() {
  $("#productCenterList").innerHTML = productCenters
    .map((product, index) => {
      const usedCount = state.tasks.filter((task) => task.product === product).length;
      return `
        <div class="product-center-row">
          <strong>${product}</strong>
          <span>${t("tasks.productsUsed", { count: usedCount })}</span>
          <div class="row-actions">
            <button data-action="edit-product-center" data-index="${index}">${t("common.edit")}</button>
            <button data-action="delete-product-center" data-index="${index}">${t("common.delete")}</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function closeProductCenterEditor() {
  editingProductCenterIndex = null;
  $("#productCenterForm").reset();
}

function taskDescription(task) {
  const isLong = task.description.length > 42;
  const expanded = expandedTaskDescriptions.has(task.id);
  const text = isLong && !expanded ? `${task.description.slice(0, 42)}...` : task.description;
  return `
    <p>${text}</p>
    ${isLong ? `<button class="text-button" data-action="toggle-task-description" data-id="${task.id}">${expanded ? t("tasks.collapseDesc") : t("tasks.expand")}</button>` : ""}
  `;
}

function normalizeHeader(value) {
  return value.replace(/\s/g, "").toLowerCase();
}

function splitImportLine(line) {
  if (line.includes("\t")) return line.split("\t").map((item) => item.trim());
  if (line.includes(",")) return line.split(",").map((item) => item.trim());
  return line.split(/\s{2,}|；|;/).map((item) => item.trim()).filter(Boolean);
}

function fieldIndex(headers, names) {
  return headers.findIndex((header) => names.some((name) => normalizeHeader(header).includes(name)));
}

function inferProductCenter(text) {
  const matched = productCenters.find((product) => text.includes(product));
  if (matched) return matched;
  return productCenters[0];
}

function parseImportedTasks(raw) {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  const first = splitImportLine(lines[0]);
  const hasHeader = first.some((item) => /任务|标题|产品|描述|截止|优先/.test(item));
  const headers = hasHeader ? first : [];
  const rows = hasHeader ? lines.slice(1) : lines;
  const titleIndex = fieldIndex(headers, ["任务名称", "任务", "标题", "name", "title"]);
  const productIndex = fieldIndex(headers, ["产品中心", "产品", "product"]);
  const descriptionIndex = fieldIndex(headers, ["任务描述", "描述", "说明", "description", "desc"]);
  const createdAtIndex = fieldIndex(headers, ["创建日期", "创建时间", "月份", "month", "created"]);
  const deadlineIndex = fieldIndex(headers, ["截止日期", "截止", "deadline", "due"]);
  const priorityIndex = fieldIndex(headers, ["优先级", "priority"]);
  const contactIndex = fieldIndex(headers, ["对接人", "contact", "liaison"]);

  return rows.map((line) => {
    const cells = splitImportLine(line);
    const fullText = cells.join(" ");
    const title = cells[titleIndex >= 0 ? titleIndex : 0] || t("common.unnamed");
    const product = cells[productIndex] || inferProductCenter(fullText);
    const description = cells[descriptionIndex >= 0 ? descriptionIndex : 2] || cells[1] || fullText;
    const createdAt = normalizeCreatedAt(cells[createdAtIndex] || "");
    const deadline = dateToLabel(cells[deadlineIndex] || "");
    const priorityText = cells[priorityIndex] || fullText;
    const priority = /高|high/i.test(priorityText) ? "高" : /低|low/i.test(priorityText) ? "低" : "中";
    const contact = cells[contactIndex] || "";
    return { title, product, description, createdAt, deadline, priority, contact };
  });
}

function migrateState() {
  if (!state.guides) state.guides = [];
  if (!state.knowledgeLanguageIds) {
    state.knowledgeLanguageIds = [...new Set(allKnowledgeEntries().map((item) => item.language).filter(Boolean))];
  }
  normalizeLanguageData();
  state.interns.forEach((intern) => migrateInternWorkDays(intern));
  state.tasks.forEach((task) => {
    if (task.contact === undefined) task.contact = "";
  });
  allKnowledgeEntries().forEach((item) => {
    if (!item.submitter) item.submitter = "未填写";
  });
  state.guides.forEach((guide) => {
    if (guide.pinned === undefined) guide.pinned = false;
  });
  syncKnowledgeLanguages();
}

function closeGuideForm() {
  editingGuideId = null;
  $("#guideForm").reset();
  $("#guideForm").classList.add("hidden");
}

function openGuideForm(guide = null) {
  editingGuideId = guide?.id ?? null;
  $("#guideForm").classList.remove("hidden");
  $("#guideForm").elements.title.value = guide?.title ?? "";
  $("#guideForm").elements.content.value = guide?.content ?? "";
}

function renderGuides() {
  const list = $("#guideList");
  if (!list) return;
  if (!state.guides.length) {
    list.innerHTML = `<div class="empty-row">${t("guides.empty")}</div>`;
    return;
  }
  const sortedGuides = [...state.guides].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return Number(b.id) - Number(a.id);
  });
  list.innerHTML = sortedGuides
    .map((guide) => {
      const collapsed = collapsedGuideIds.has(guide.id);
      const preview = guide.content.length > 160 ? `${guide.content.slice(0, 160)}...` : guide.content;
      const typeLabel = guide.type === "file" ? t("guides.typeUploaded", { file: guide.fileName }) : t("guides.typeCreated");
      const pinAction = guide.pinned ? "unpin-guide" : "pin-guide";
      const pinLabel = guide.pinned ? t("guides.unpin") : t("guides.pin");
      return `
        <article class="guide-card">
          <div class="guide-card-head">
            <button type="button" class="guide-title-button" data-action="toggle-guide-fold" data-id="${guide.id}" aria-expanded="${!collapsed}">${guide.title}</button>
            <span class="guide-meta">${typeLabel} · ${guide.createdAt}</span>
          </div>
          <div class="guide-card-content ${collapsed ? "hidden" : ""}">
            <p>${preview}</p>
            <div class="row-actions">
              <button type="button" data-action="toggle-pin-guide" data-id="${guide.id}" data-pin-action="${pinAction}">${pinLabel}</button>
              <button type="button" data-action="view-guide" data-id="${guide.id}">${t("common.view")}</button>
              <button type="button" data-action="edit-guide" data-id="${guide.id}">${t("common.edit")}</button>
              <button type="button" data-action="delete-guide" data-id="${guide.id}">${t("common.delete")}</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function addImportedTasks(items, fallbackMonth = "") {
  const firstIntern = internsForLanguage(activeLanguage)[0];
  const fallbackCreatedAt = normalizeCreatedAt(fallbackMonth);
  items.forEach((item, index) => {
    if (!productCenters.includes(item.product)) productCenters.push(item.product);
    state.tasks.unshift({
      id: Date.now() + index,
      title: item.title,
      product: item.product,
      language: activeLanguage,
      status: "todo",
      assignee: firstIntern?.name ?? "",
      contact: item.contact ?? "",
      progress: 0,
      priority: item.priority,
      words: 0,
      createdAt: item.createdAt || fallbackCreatedAt || todayLabel(),
      deadline: item.deadline,
      description: item.description,
    });
  });
}

function syncTaskAssignees() {
  state.tasks.forEach((task) => {
    const interns = internsForLanguage(task.language);
    const names = interns.map((intern) => intern.name);
    if (!names.includes(task.assignee)) {
      task.assignee = interns[0]?.name ?? "";
    }
  });
}

function knowledgeActions(type, id) {
  return `
    <div class="row-actions knowledge-actions">
      <button data-action="edit-knowledge" data-type="${type}" data-id="${id}">${t("common.edit")}</button>
      <button data-action="delete-knowledge" data-type="${type}" data-id="${id}">${t("common.delete")}</button>
    </div>
  `;
}

function openKnowledgeForm(item = null) {
  const form = $("#knowledgeForm");
  form.classList.remove("hidden");
  form.elements.category.value = item?.category ?? "maintenance";
  form.elements.title.value = item?.title ?? "";
  form.elements.meta.value = item?.meta ?? "";
  form.elements.detail.value = item?.detail ?? "";
  form.elements.submitter.value = item?.submitter ?? "";
}

function closeKnowledgeForm() {
  editingKnowledge = null;
  $("#knowledgeForm").reset();
  $("#knowledgeForm").classList.add("hidden");
}

function getKnowledgeFormItem(form) {
  return {
    category: form.get("category"),
    title: form.get("title").trim(),
    meta: form.get("meta").trim(),
    detail: form.get("detail").trim(),
    submitter: form.get("submitter").trim(),
  };
}

function getKnowledgeItem(type, id) {
  if (type === "maintenance") {
    const item = state.maintenance.find((entry) => entry.id === id);
    return item && { category: type, title: item.title, meta: item.status, detail: item.note, submitter: item.submitter };
  }
  if (type === "resource") {
    const item = state.resourceStatus.find((entry) => entry.id === id);
    return item && {
      category: type,
      title: item.name,
      meta: item.status,
      detail: item.note ?? t("knowledge.resourceNote", { updated: item.updated, count: item.count }),
      submitter: item.submitter,
    };
  }
  const item = state.updateLog.find((entry) => entry.id === id);
  return item && { category: type, title: item.item, meta: item.date, detail: item.detail, submitter: item.submitter };
}

function upsertKnowledgeItem(item) {
  if (editingKnowledge && editingKnowledge.type !== item.category) {
    if (editingKnowledge.type === "maintenance") state.maintenance = state.maintenance.filter((entry) => entry.id !== editingKnowledge.id);
    if (editingKnowledge.type === "resource") state.resourceStatus = state.resourceStatus.filter((entry) => entry.id !== editingKnowledge.id);
    if (editingKnowledge.type === "update") state.updateLog = state.updateLog.filter((entry) => entry.id !== editingKnowledge.id);
  }

  if (item.category === "maintenance") {
    const value = {
      id: editingKnowledge?.id ?? Date.now(),
      language: activeKnowledgeLanguage,
      title: item.title,
      owner: "偏好",
      status: item.meta,
      due: languageName(activeKnowledgeLanguage),
      note: item.detail,
      submitter: item.submitter,
    };
    if (editingKnowledge?.type === "maintenance") {
      const index = state.maintenance.findIndex((entry) => entry.id === editingKnowledge.id);
      if (index >= 0) state.maintenance[index] = value;
    }
    else state.maintenance.unshift(value);
  }

  if (item.category === "resource") {
    const value = {
      id: editingKnowledge?.id ?? Date.now(),
      language: activeKnowledgeLanguage,
      name: item.title,
      count: 100,
      updated: 100,
      status: item.meta,
      note: item.detail,
      submitter: item.submitter,
    };
    if (editingKnowledge?.type === "resource") {
      const index = state.resourceStatus.findIndex((entry) => entry.id === editingKnowledge.id);
      const existing = state.resourceStatus[index];
      if (index >= 0) state.resourceStatus[index] = { ...existing, ...value };
    } else state.resourceStatus.unshift(value);
  }

  if (item.category === "update") {
    const value = {
      id: editingKnowledge?.id ?? Date.now(),
      language: activeKnowledgeLanguage,
      date: item.meta,
      item: item.title,
      detail: item.detail,
      submitter: item.submitter,
    };
    if (editingKnowledge?.type === "update") {
      const index = state.updateLog.findIndex((entry) => entry.id === editingKnowledge.id);
      if (index >= 0) state.updateLog[index] = value;
    }
    else state.updateLog.unshift(value);
  }
}

function filteredInterns() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  return state.interns.filter((intern) => {
    const haystack = [intern.name, languageName(intern.language)].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });
}

function filteredTasks() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  return state.tasks.filter((task) => {
    const haystack = [task.title, task.product, task.assignee, task.contact, task.description, languageName(task.language)].join(" ").toLowerCase();
    return task.language === activeLanguage && (!query || haystack.includes(query));
  });
}

function filteredKnowledge(list) {
  return list.filter((item) => item.language === activeKnowledgeLanguage);
}

function monthLabel(date) {
  return monthLabelI18n(date);
}

function monthGroupKey(date) {
  return date.slice(0, 2);
}

function renderLanguages() {
  syncLanguagesFromInterns();
  const linkedLanguages = getLinkedLanguages();
  $("#languageTabs").innerHTML = linkedLanguages
    .map((language) => `<button class="${language.id === activeLanguage ? "active" : ""}" data-language="${language.id}">${displayLanguageLabel(language)}</button>`)
    .join("");

  const datalist = $("#languageOptions");
  if (datalist) {
    datalist.innerHTML = languages.map((language) => `<option value="${displayLanguageLabel(language)}"></option>`).join("");
  }
  $("#taskForm select[name='product']").innerHTML = productCenterOptions();
}

function renderMetrics() {
  const completed = state.tasks.filter((task) => task.status === "done").length;
  const activeTasks = state.tasks.filter((task) => task.status !== "done").length;
  const currentMonth = todayLabel().slice(0, 2);
  const weeklyTasks = state.tasks.filter((task) => task.createdAt.startsWith(currentMonth)).length;
  const maintenanceOpen = state.maintenance.length + state.resourceStatus.length + state.updateLog.length;
  const metrics = [
    [t("metrics.interns"), state.interns.length, t("metrics.languageLines", { count: getLinkedLanguages().length })],
    [t("metrics.activeTasks"), activeTasks, t("metrics.completed", { count: completed })],
    [t("metrics.weeklyTasks"), weeklyTasks, t("metrics.weeklyNote")],
    [t("metrics.knowledge"), maintenanceOpen, t("metrics.knowledgeNote")],
  ];
  $("#metrics").innerHTML = metrics
    .map(([label, value, note]) => `<article class="metric"><p class="eyebrow">${label}</p><strong>${value}</strong><span>${note}</span></article>`)
    .join("");
}

function taskRow(task, compact = false) {
  return `
    <div class="task-row ${compact ? "compact" : ""}">
      <span>${task.product}</span>
      <div class="task-title-cell">
        <strong>${task.title}</strong>
        ${taskDescription(task)}
      </div>
      ${
        compact
          ? `<span>${task.assignee}</span>`
          : `<select class="task-assignee-select" data-task-id="${task.id}" aria-label="${t("task.assigneeAria", { title: task.title })}">${assigneeOptions(task)}</select>`
      }
      ${compact ? "" : `<span class="task-contact-cell" title="${task.contact || t("common.notFilled")}">${task.contact || "—"}</span>`}
      ${compact ? "" : `<span>${languageName(task.language)}</span>`}
      <span>${displayTaskDate(task.createdAt)}</span>
      <span>${displayDeadline(task.deadline)}</span>
      <span class="priority-badge ${task.priority === "高" ? "high" : ""}">${displayPriority(task.priority)}</span>
      <div class="progress${task.progress >= 100 ? " progress-complete" : ""}" aria-label="${t("common.progress", { percent: task.progress })}"><span style="width:${task.progress}%"></span></div>
      ${
        compact
          ? ""
          : `<div class="row-actions"><button data-action="complete-task" data-id="${task.id}" ${task.status === "done" ? "disabled" : ""}>${task.status === "done" ? t("common.completed") : t("common.complete")}</button><button data-action="edit-task" data-id="${task.id}">${t("common.edit")}</button><button data-action="delete-task" data-id="${task.id}">${t("common.delete")}</button></div>`
      }
    </div>
  `;
}

function renderDashboard() {
  const today = todayLabel();
  const todayTasks = state.tasks
    .filter((task) => task.createdAt === today)
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);
  $("#priorityTasks").innerHTML = todayTasks.length
    ? todayTasks.map((task) => taskRow(task, true)).join("")
    : `<div class="empty-row">${t("dashboard.noTasksToday")}</div>`;
}

function renderInterns() {
  $("#internTable").innerHTML = filteredInterns()
    .map(
      (intern) => {
        const isEditing = editingInternId === intern.id;
        return `
        <tr data-intern-id="${intern.id}">
          <td>
            ${
              isEditing
                ? `<input class="edit-intern-name" value="${intern.name}" aria-label="${t("intern.editNameAria")}" />`
                : `<strong>${intern.name}</strong>`
            }
          </td>
          <td>
            <input class="intern-language-input" data-id="${intern.id}" list="languageOptions" value="${languageInputValue(intern.language)}" aria-label="${t("intern.languageAria", { name: intern.name })}" />
          </td>
          <td>
            ${
              isEditing
                ? `<input class="intern-work-days" value="${intern.workDays ?? ""}" placeholder="${t("interns.workDaysEditPh")}" aria-label="${t("intern.scheduleAria", { name: intern.name })}" />`
                : `<span class="intern-work-days-display">${displayWorkDays(intern.workDays)}</span>`
            }
          </td>
          <td>
            <div class="row-actions">
              ${isEditing ? `<button data-action="save-intern" data-id="${intern.id}">${t("common.save")}</button><button data-action="cancel-edit" data-id="${intern.id}">${t("common.cancel")}</button>` : `<button data-action="edit-intern" data-id="${intern.id}">${t("common.edit")}</button>`}
              <button data-action="delete" data-id="${intern.id}">${t("common.delete")}</button>
            </div>
          </td>
        </tr>
      `;
      },
    )
    .join("");
}

function renderTasks() {
  $("#taskLanguageTitle").textContent = t("tasks.title");
  const tasks = filteredTasks();
  const grouped = tasks.reduce((result, task) => {
    const key = monthGroupKey(task.createdAt);
    result[key] = result[key] ?? [];
    result[key].push(task);
    return result;
  }, {});
  const groups = Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a, "zh-CN"))
    .map(
      ([monthKey, monthTasks]) => `
        <section class="month-group ${collapsedMonths.has(monthKey) ? "collapsed" : ""}" data-month="${monthKey}">
          <button class="month-toggle" data-month="${monthKey}" aria-expanded="${!collapsedMonths.has(monthKey)}">
            <span>${monthLabel(`${monthKey}-01`)}</span>
            <span>${t("common.tasksUnit", { count: monthTasks.length })}</span>
          </button>
          <div class="task-list">
            <div class="task-list-head">
              <span>${t("tasks.col.product")}</span>
              <span>${t("tasks.col.description")}</span>
              <span>${t("tasks.col.assignee")}</span>
              <span>${t("tasks.col.contact")}</span>
              <span>${t("tasks.col.language")}</span>
              <span>${t("tasks.col.created")}</span>
              <span>${t("tasks.col.deadline")}</span>
              <span>${t("tasks.col.priority")}</span>
              <span>${t("tasks.col.progress")}</span>
              <span>${t("tasks.col.actions")}</span>
            </div>
            ${monthTasks.map((task) => taskRow(task)).join("")}
          </div>
        </section>
      `,
    )
    .join("");
  $("#taskBoard").innerHTML = groups || `<div class="empty-row">${t("tasks.empty")}</div>`;
}

function renderKnowledgeLanguageTabs() {
  const tabs = $("#knowledgeLanguageTabs");
  if (!tabs) return;
  const linked = getKnowledgeLanguages();
  tabs.innerHTML = linked
    .map(
      (language) =>
        `<button type="button" class="${language.id === activeKnowledgeLanguage ? "active" : ""}" data-knowledge-language="${language.id}">${displayLanguageLabel(language)}</button>`,
    )
    .join("");
  const title = $("#knowledgeLanguageTitle");
  if (title) {
    title.textContent = t("knowledge.titleWithLang", { lang: languageName(activeKnowledgeLanguage) });
  }
}

function knowledgeCategoryPanel(category, title, items, renderRow) {
  const collapsed = collapsedKnowledgeCategories.has(category);
  const body = items.length
    ? items.map((item) => renderRow(item)).join("")
    : `<div class="empty-row">${t("knowledge.emptyCategory", { category: title })}</div>`;
  return `
    <section class="panel knowledge-category ${collapsed ? "collapsed" : ""}" data-category="${category}">
      <button type="button" class="category-toggle" data-category="${category}" aria-expanded="${!collapsed}">
        <span class="category-toggle-title">${title}</span>
        <span class="category-count">${t("common.entries", { count: items.length })}</span>
      </button>
      <div class="category-body">${body}</div>
    </section>
  `;
}

function renderKnowledge() {
  syncKnowledgeLanguages();
  renderKnowledgeLanguageTabs();

  const maintenanceItems = filteredKnowledge(state.maintenance);
  const resourceItems = filteredKnowledge(state.resourceStatus);
  const updateItems = filteredKnowledge(state.updateLog);

  $("#knowledgeLayout").innerHTML = [
    knowledgeCategoryPanel(
      "maintenance",
      t("knowledge.cat.preference"),
      maintenanceItems,
      (item) => `
        <div class="knowledge-row">
          <span class="tag">${item.status}</span>
          <strong>${item.title}</strong>
          <span>${item.note}</span>
          <span class="submitter">${item.submitter ?? t("common.notFilled")}</span>
          ${knowledgeActions("maintenance", item.id)}
        </div>
      `,
    ),
    knowledgeCategoryPanel(
      "resource",
      t("knowledge.cat.writing"),
      resourceItems,
      (item) => `
        <div class="knowledge-row">
          <span class="tag">${item.status}</span>
          <strong>${item.name}</strong>
          <span>${item.note ?? t("knowledge.resourceNote", { updated: item.updated, count: item.count })}</span>
          <span class="submitter">${item.submitter ?? t("common.notFilled")}</span>
          ${knowledgeActions("resource", item.id)}
        </div>
      `,
    ),
    knowledgeCategoryPanel(
      "update",
      t("knowledge.cat.taboo"),
      updateItems,
      (item) => `
        <div class="knowledge-row">
          <span class="tag">${item.date}</span>
          <strong>${item.item}</strong>
          <span>${item.detail}</span>
          <span class="submitter">${item.submitter ?? t("common.notFilled")}</span>
          ${knowledgeActions("update", item.id)}
        </div>
      `,
    ),
  ].join("");
}

function renderReports() {
  const productStats = productCenters.map((product) => [product, state.tasks.filter((task) => task.product === product).length]);
  const maxProduct = Math.max(1, ...productStats.map(([, value]) => value));
  $("#productStats").innerHTML = productStats
    .map(([label, value]) => {
      const height = Math.max(18, Math.round((value / maxProduct) * 100));
      return `<div class="chart-col"><div class="chart-bar" style="height:${height}%"></div><span>${label}<br>${t("reports.countItems", { count: value })}</span></div>`;
    })
    .join("");

  const languageStats = languages.map((language) => [displayLanguageLabel(language), state.tasks.filter((task) => task.language === language.id).length]);
  const maxLanguage = Math.max(1, ...languageStats.map(([, value]) => value));
  $("#languageStats").innerHTML = languageStats
    .map(([label, value]) => {
      const height = Math.max(18, Math.round((value / maxLanguage) * 100));
      return `<div class="chart-col"><div class="chart-bar" style="height:${height}%"></div><span>${label}<br>${t("reports.countItems", { count: value })}</span></div>`;
    })
    .join("");

  const totalTasks = state.tasks.length;
  const activeTasks = state.tasks.filter((task) => task.status !== "done").length;
  const highTasks = state.tasks.filter((task) => task.priority === "高").length;
  $("#taskVolumeStats").innerHTML = [
    [t("reports.totalTasks"), totalTasks, totalTasks],
    [t("reports.activeTasks"), activeTasks, totalTasks],
    [t("reports.highPriority"), highTasks, totalTasks],
  ]
    .map(([label, value, max]) => {
      const percent = max ? Math.round((value / max) * 100) : 0;
      return `<article class="stat-row visual-stat"><div><strong>${label}</strong><span>${t("reports.countItems", { count: value })}</span></div><div class="progress"><span style="width:${percent}%"></span></div></article>`;
    })
    .join("");

  const knowledgeLangs = getKnowledgeLanguages();
  const knowledgeCounts = knowledgeLangs.map((language) => {
    const count = allKnowledgeEntries().filter((item) => item.language === language.id).length;
    return [displayLanguageLabel(language), count, language.id];
  });
  const maxKnowledge = Math.max(1, ...knowledgeCounts.map(([, count]) => count));
  $("#knowledgeContributionStats").innerHTML = knowledgeCounts.length
    ? knowledgeCounts
        .map(([label, count]) => {
          const percent = Math.round((count / maxKnowledge) * 100);
          return `<article class="stat-row visual-stat"><div><strong>${label}</strong><span>${t("reports.contrib", { count })}</span></div><div class="progress"><span style="width:${percent}%"></span></div></article>`;
        })
        .join("")
    : `<div class="empty-row">${t("reports.noKnowledgeLang")}</div>`;
}

function renderAll() {
  migrateState();
  syncTaskAssignees();
  renderLanguages();
  renderProductCenters();
  renderMetrics();
  renderDashboard();
  renderInterns();
  renderTasks();
  renderKnowledge();
  renderReports();
  renderGuides();
  applyStaticI18n();
}

function switchView(view) {
  activeView = view;
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === view));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  const titleKeys = {
    dashboard: "nav.dashboard",
    interns: "nav.internsTitle",
    tasks: "nav.tasksTitle",
    knowledge: "nav.knowledgeTitle",
    reports: "nav.reportsTitle",
    guides: "nav.guidesTitle",
  };
  $("#pageTitle").textContent = t(titleKeys[view] ?? "nav.dashboard");
}

document.addEventListener("click", (event) => {
  const uiLocaleBtn = event.target.closest("[data-ui-locale]");
  if (uiLocaleBtn) {
    setUiLocale(uiLocaleBtn.dataset.uiLocale);
    renderAll();
    switchView(activeView);
    return;
  }

  const nav = event.target.closest(".nav-item");
  if (nav) switchView(nav.dataset.view);

  const knowledgeLanguage = event.target.closest("[data-knowledge-language]");
  if (knowledgeLanguage) {
    activeKnowledgeLanguage = knowledgeLanguage.dataset.knowledgeLanguage;
    renderKnowledge();
    renderReports();
    switchView(activeView);
    return;
  }

  const language = event.target.closest("[data-language]");
  if (language) {
    activeLanguage = language.dataset.language;
    renderAll();
    switchView(activeView);
  }

  if (event.target.id === "openKnowledgeLanguageForm") {
    $("#knowledgeLanguageForm").classList.toggle("hidden");
  }

  if (event.target.id === "cancelKnowledgeLanguage") {
    $("#knowledgeLanguageForm").reset();
    $("#knowledgeLanguageForm").classList.add("hidden");
  }

  const categoryToggle = event.target.closest(".knowledge-category .category-toggle");
  if (categoryToggle) {
    const category = categoryToggle.dataset.category;
    if (collapsedKnowledgeCategories.has(category)) collapsedKnowledgeCategories.delete(category);
    else collapsedKnowledgeCategories.add(category);
    renderKnowledge();
  }

  if (event.target.closest("#openInternForm")) {
    $("#internForm").classList.toggle("hidden");
    return;
  }

  if (event.target.closest("#cancelInternForm")) {
    $("#internForm").reset();
    $("#internForm").classList.add("hidden");
    return;
  }

  if (event.target.closest("#openTaskForm")) {
    editingTaskId = null;
    closeTaskPanels();
    openTaskForm();
    return;
  }

  if (event.target.id === "taskFormModal" || event.target.closest("#closeTaskModal")) {
    closeTaskForm();
    return;
  }

  if (event.target.closest("#cancelTaskEdit")) {
    closeTaskForm();
    return;
  }

  if (event.target.closest("#openProductCenterPanel")) {
    toggleTaskPanel("productCenterPanel");
    return;
  }

  if (event.target.closest("#closeProductCenterPanel")) {
    $("#productCenterPanel").classList.add("hidden");
    closeProductCenterEditor();
    return;
  }

  if (event.target.closest("#openImportPanel")) {
    toggleTaskPanel("importPanel");
    return;
  }

  if (event.target.closest("#closeImportPanel")) {
    $("#importPanel").classList.add("hidden");
    return;
  }

  if (event.target.closest("#cancelProductCenterEdit")) {
    closeProductCenterEditor();
    return;
  }

  if (event.target.id === "openKnowledgeForm") {
    editingKnowledge = null;
    openKnowledgeForm();
  }

  if (event.target.id === "cancelKnowledgeEdit") {
    closeKnowledgeForm();
  }

  if (event.target.id === "openGuideForm") {
    editingGuideId = null;
    openGuideForm();
  }

  if (event.target.id === "cancelGuideEdit") {
    closeGuideForm();
  }

  const monthToggle = event.target.closest(".month-toggle");
  if (monthToggle) {
    const month = monthToggle.dataset.month;
    if (collapsedMonths.has(month)) collapsedMonths.delete(month);
    else collapsedMonths.add(month);
    renderTasks();
  }

  const action = event.target.dataset.action;
  if (action === "delete") {
    const id = Number(event.target.dataset.id);
    state.interns = state.interns.filter((intern) => intern.id !== id);
    if (editingInternId === id) editingInternId = null;
    persistData();
    renderAll();
    showToast(t("toast.internDeleted"));
  }
  if (action === "edit-intern") {
    const id = Number(event.target.dataset.id);
    editingInternId = id;
    renderInterns();
  }
  if (action === "cancel-edit") {
    editingInternId = null;
    renderInterns();
  }
  if (action === "save-intern") {
    const id = Number(event.target.dataset.id);
    const row = document.querySelector(`tr[data-intern-id="${id}"]`);
    const intern = state.interns.find((item) => item.id === id);
    const previousName = intern?.name;
    const name = row?.querySelector(".edit-intern-name")?.value.trim();
    const language = ensureLanguage(row?.querySelector(".intern-language-input")?.value);
    if (!intern || !name || !language) {
      showToast(t("toast.internNameRequired"));
      return;
    }
    intern.name = name;
    intern.workDays = normalizeWorkDays(row?.querySelector(".intern-work-days")?.value);
    applyInternLanguageChange(intern, language);
    state.tasks.forEach((task) => {
      if (task.assignee === previousName) task.assignee = name;
    });
    editingInternId = null;
    syncTaskAssignees();
    persistData();
    renderAll();
    showToast(t("toast.internUpdated"));
  }
  if (action === "toggle-task-description") {
    const id = Number(event.target.dataset.id);
    if (expandedTaskDescriptions.has(id)) expandedTaskDescriptions.delete(id);
    else expandedTaskDescriptions.add(id);
    renderDashboard();
    renderTasks();
  }
  if (action === "edit-task") {
    const id = Number(event.target.dataset.id);
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    editingTaskId = id;
    openTaskForm(task);
  }
  if (action === "complete-task") {
    const id = Number(event.target.dataset.id);
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    task.status = "done";
    task.progress = 100;
    persistData();
    renderAll();
    switchView("tasks");
    showToast(t("toast.taskCompleted"));
  }
  if (action === "delete-task") {
    const id = Number(event.target.dataset.id);
    state.tasks = state.tasks.filter((task) => task.id !== id);
    if (editingTaskId === id) closeTaskForm();
    expandedTaskDescriptions.delete(id);
    persistData();
    renderAll();
    switchView("tasks");
    showToast(t("toast.taskDeleted"));
  }
  if (action === "edit-product-center") {
    editingProductCenterIndex = Number(event.target.dataset.index);
    $("#productCenterForm").elements.name.value = productCenters[editingProductCenterIndex];
    $("#productCenterForm").elements.name.focus();
  }
  if (action === "delete-product-center") {
    const index = Number(event.target.dataset.index);
    const product = productCenters[index];
    const isUsed = state.tasks.some((task) => task.product === product);
    if (isUsed) {
      showToast(t("toast.productInUse"));
      return;
    }
    productCenters.splice(index, 1);
    if (editingProductCenterIndex === index) closeProductCenterEditor();
    persistData();
    renderAll();
    switchView("tasks");
    showToast(t("toast.productDeleted"));
  }
  if (action === "edit-knowledge") {
    const type = event.target.dataset.type;
    const id = Number(event.target.dataset.id);
    const item = getKnowledgeItem(type, id);
    if (!item) return;
    editingKnowledge = { type, id };
    openKnowledgeForm(item);
  }
  if (action === "delete-knowledge") {
    const type = event.target.dataset.type;
    const id = Number(event.target.dataset.id);
    if (type === "maintenance") state.maintenance = state.maintenance.filter((entry) => entry.id !== id);
    if (type === "resource") state.resourceStatus = state.resourceStatus.filter((entry) => entry.id !== id);
    if (type === "update") state.updateLog = state.updateLog.filter((entry) => entry.id !== id);
    if (editingKnowledge?.type === type && editingKnowledge.id === id) closeKnowledgeForm();
    persistData();
    renderAll();
    switchView("knowledge");
    showToast(t("toast.knowledgeDeleted"));
  }
  if (action === "view-guide") {
    const id = Number(event.target.dataset.id);
    const guide = state.guides.find((item) => item.id === id);
    if (!guide) return;
    openGuideForm(guide);
    switchView("guides");
  }
  if (action === "edit-guide") {
    const id = Number(event.target.dataset.id);
    const guide = state.guides.find((item) => item.id === id);
    if (!guide) return;
    openGuideForm(guide);
    switchView("guides");
  }
  if (action === "toggle-pin-guide") {
    const id = Number(event.target.dataset.id);
    const guide = state.guides.find((item) => item.id === id);
    if (!guide) return;
    guide.pinned = !guide.pinned;
    persistData();
    renderGuides();
    showToast(guide.pinned ? t("toast.guidePinned") : t("toast.guideUnpinned"));
  }
  if (action === "delete-guide") {
    const id = Number(event.target.dataset.id);
    state.guides = state.guides.filter((item) => item.id !== id);
    if (editingGuideId === id) closeGuideForm();
    collapsedGuideIds.delete(id);
    persistData();
    renderGuides();
    showToast(t("toast.guideDeleted"));
  }
  if (action === "toggle-guide-fold") {
    const id = Number(event.target.dataset.id);
    if (collapsedGuideIds.has(id)) collapsedGuideIds.delete(id);
    else collapsedGuideIds.add(id);
    renderGuides();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "globalSearch") {
    renderDashboard();
    renderInterns();
    renderTasks();
    renderKnowledge();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.classList.contains("intern-language-input")) {
    const intern = state.interns.find((item) => item.id === Number(event.target.dataset.id));
    if (!intern) return;
    const languageId = ensureLanguage(event.target.value);
    if (!languageId) return;
    applyInternLanguageChange(intern, languageId);
    syncTaskAssignees();
    persistData();
    renderAll();
    showToast(t("toast.internLangSynced"));
  }
  if (event.target.classList.contains("task-assignee-select")) {
    const task = state.tasks.find((item) => item.id === Number(event.target.dataset.taskId));
    if (!task) return;
    task.assignee = event.target.value;
    persistData();
    renderDashboard();
    renderReports();
    showToast(t("toast.assigneeUpdated"));
  }
});

$("#internForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const language = ensureLanguage(form.get("language"));
  if (!language) {
    showToast(t("toast.internLangRequired"));
    return;
  }
  state.interns.unshift({
    id: Date.now(),
    name: form.get("name"),
    language,
    workDays: normalizeWorkDays(form.get("workDays")),
    score: 82,
    load: 0,
  });
  event.currentTarget.reset();
  event.currentTarget.classList.add("hidden");
  persistData();
  renderAll();
  showToast(t("toast.internAdded"));
});

$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const firstIntern = internsForLanguage(activeLanguage)[0];
  const wasEditing = editingTaskId !== null;
  const value = {
    id: editingTaskId ?? Date.now(),
    title: form.get("title").trim(),
    product: form.get("product").trim(),
    language: activeLanguage,
    status: "todo",
    assignee: firstIntern?.name ?? "",
    contact: form.get("contact").trim(),
    progress: 0,
    priority: form.get("priority"),
    words: 0,
    createdAt: todayLabel(),
    deadline: dateToLabel(form.get("deadline")),
    description: form.get("description").trim(),
  };

  if (wasEditing) {
    const index = state.tasks.findIndex((task) => task.id === editingTaskId);
    const existing = state.tasks[index];
    state.tasks[index] = { ...existing, ...value, createdAt: existing.createdAt, assignee: existing.assignee, progress: existing.progress, status: existing.status, words: existing.words };
  } else {
    state.tasks.unshift(value);
  }

  closeTaskForm();
  persistData();
  renderAll();
  switchView("tasks");
  showToast(wasEditing ? t("toast.taskUpdated") : t("toast.taskCreated"));
});

$("#productCenterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name").trim();
  if (!name) {
    showToast(t("toast.productNameRequired"));
    return;
  }
  const duplicate = productCenters.some((product, index) => product === name && index !== editingProductCenterIndex);
  if (duplicate) {
    showToast(t("toast.productExists"));
    return;
  }

  if (editingProductCenterIndex === null) {
    productCenters.push(name);
    showToast(t("toast.productAdded"));
  } else {
    const oldName = productCenters[editingProductCenterIndex];
    productCenters[editingProductCenterIndex] = name;
    state.tasks.forEach((task) => {
      if (task.product === oldName) task.product = name;
    });
    showToast(t("toast.productUpdated"));
  }

  closeProductCenterEditor();
  closeTaskPanels();
  persistData();
  renderAll();
  switchView("tasks");
});

$("#importTaskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const raw = form.get("raw").trim();
  if (!raw) {
    showToast(t("toast.importPasteRequired"));
    return;
  }
  const items = parseImportedTasks(raw);
  if (!items.length) {
    showToast(t("toast.importNone"));
    return;
  }
  addImportedTasks(items, form.get("importMonth"));
  event.currentTarget.reset();
  $("#importPanel").classList.add("hidden");
  persistData();
  renderAll();
  switchView("tasks");
  showToast(t("toast.imported", { count: items.length }));
});

$("#guideForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const title = form.get("title").trim();
  const content = form.get("content").trim();
  if (!title || !content) {
    showToast(t("toast.guideRequired"));
    return;
  }
  if (editingGuideId) {
    const guide = state.guides.find((item) => item.id === editingGuideId);
    if (guide) {
      guide.title = title;
      guide.content = content;
    }
    showToast(t("toast.guideUpdated"));
  } else {
    state.guides.unshift({
      id: Date.now(),
      title,
      content,
      type: "text",
      fileName: "",
      createdAt: todayLabel(),
      pinned: false,
    });
    showToast(t("toast.guideCreated"));
  }
  closeGuideForm();
  persistData();
  renderGuides();
  switchView("guides");
});

$("#guideFileInput").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    showToast(t("toast.fileTooLarge"));
    event.target.value = "";
    return;
  }
  try {
    const lowerName = file.name.toLowerCase();
    const isOfficeDoc = [".doc", ".docx", ".xls", ".xlsx"].some((ext) => lowerName.endsWith(ext));
    const content = isOfficeDoc ? t("guides.uploadedFile", { file: file.name }) : await file.text();
    state.guides.unshift({
      id: Date.now(),
      title: file.name.replace(/\.[^.]+$/, "") || file.name,
      content,
      type: "file",
      fileName: file.name,
      createdAt: todayLabel(),
      pinned: false,
    });
    persistData();
    renderGuides();
    switchView("guides");
    showToast(t("toast.guideUploaded"));
  } catch {
    showToast(t("toast.fileReadFailed"));
  }
  event.target.value = "";
});

$("#knowledgeLanguageForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const label = new FormData(event.currentTarget).get("label").trim();
  if (!label) {
    showToast(t("toast.langNameRequired"));
    return;
  }
  addKnowledgeLanguage(label);
  event.currentTarget.reset();
  event.currentTarget.classList.add("hidden");
  persistData();
  renderAll();
  switchView("knowledge");
  showToast(t("toast.langAdded", { label }));
});

$("#knowledgeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const item = getKnowledgeFormItem(new FormData(event.currentTarget));
  if (!item.title || !item.meta || !item.detail || !item.submitter) {
    showToast(t("toast.knowledgeRequired"));
    return;
  }
  upsertKnowledgeItem(item);
  closeKnowledgeForm();
  persistData();
  renderAll();
  switchView("knowledge");
  showToast(t("toast.knowledgeSaved"));
});

function startApp() {
  const launch = async () => {
    if (window.__secureStorageKey) {
      await bootstrapSecureData(window.__secureStorageKey);
      startCloudPolling(window.__secureStorageKey);
    }
    migrateState();
    applyStaticI18n();
    mountSyncStatus();
    renderAll();
    switchView("dashboard");
    showAppShell();
    if (window.__cloudSyncOffline) {
      showToast(t("toast.syncOffline"));
    }
  };
  launch();
}

function showAppShell() {
  document.querySelector(".app-shell")?.classList.remove("hidden");
}

function bootApp() {
  startApp();
}

document.addEventListener("auth-ready", bootApp, { once: true });

document.getElementById("openSyncSetupBtn")?.addEventListener("click", openSyncSetupModal);
document.getElementById("openSyncBannerBtn")?.addEventListener("click", openSyncSetupModal);
document.getElementById("closeSyncSetupModal")?.addEventListener("click", closeSyncSetupModal);
document.getElementById("syncSetupModal")?.addEventListener("click", (event) => {
  if (event.target.id === "syncSetupModal") closeSyncSetupModal();
});
document.getElementById("syncSetupForm")?.addEventListener("submit", handleSyncSetupSubmit);
