const I18N_STORAGE_KEY = "translation-intern-manager-ui-locale";

const messages = {
  zh: {
    "app.title": "翻译实习生管理系统",
    "brand.title": "翻译实习生管理",
    "brand.subtitle": "Translation Intern Ops",
    "nav.main": "主导航",
    "nav.dashboard": "概览",
    "nav.tasks": "任务",
    "nav.interns": "实习生",
    "nav.knowledge": "知识库",
    "nav.reports": "仪表盘",
    "nav.guides": "新手指南",
    "nav.dashboardTitle": "概览",
    "nav.internsTitle": "实习生管理",
    "nav.tasksTitle": "任务管理",
    "nav.knowledgeTitle": "知识库",
    "nav.reportsTitle": "仪表盘",
    "nav.guidesTitle": "新手指南",
    "topbar.eyebrow": "实习生培养 · 翻译交付 · 本地化维护",
    "topbar.search": "搜索实习生、任务、维护信息",
    "uiLocale.label": "界面语言",
    "uiLocale.zh": "中文",
    "uiLocale.en": "English",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.close": "关闭",
    "common.collapse": "收起",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.view": "查看",
    "common.add": "添加",
    "common.complete": "完成",
    "common.completed": "已完成",
    "common.actions": "操作",
    "common.notSet": "未设置",
    "common.notFilled": "未填写",
    "common.pending": "待定",
    "common.entries": "{count} 条",
    "common.countUnit": "{count}个",
    "common.tasksUnit": "{count} 个任务",
    "common.progress": "进度 {percent}%",
    "common.unnamed": "未命名任务",
    "common.addBtn": "添加",
    "intern.editNameAria": "编辑实习生姓名",
    "intern.languageAria": "{name} 负责语言",
    "intern.scheduleAria": "{name} 工作时间",
    "task.assigneeAria": "{title} 负责人",
    "dashboard.todayEyebrow": "今日任务",
    "dashboard.todayTitle": "今日新增任务",
    "dashboard.noTasksToday": "今日暂无新增任务。",
    "metrics.interns": "实习生",
    "metrics.activeTasks": "活跃任务",
    "metrics.weeklyTasks": "本周任务",
    "metrics.knowledge": "知识条目",
    "metrics.languageLines": "覆盖 {count} 条语言线",
    "metrics.completed": "{count} 个已完成",
    "metrics.weeklyNote": "本周创建任务数",
    "metrics.knowledgeNote": "偏好/书写/禁忌",
    "interns.eyebrow": "基础信息",
    "interns.title": "实习生管理",
    "interns.add": "＋ 新增实习生",
    "interns.name": "姓名",
    "interns.language": "负责语言",
    "interns.workDays": "工作时间",
    "interns.namePh": "姓名",
    "interns.languagePh": "语言，如：英语、德语、西语",
    "interns.workDaysPh": "工作时间，如：周一、周三、周五",
    "interns.workDaysEditPh": "如：周一、周三、周五",
    "tasks.title": "任务管理",
    "tasks.langTabs": "语言切换",
    "tasks.manageProducts": "管理产品中心",
    "tasks.import": "导入任务",
    "tasks.create": "＋ 新建任务",
    "tasks.importTitle": "导入任务",
    "tasks.importPh": "可粘贴表格内容，例如：任务名称\t产品中心\t任务描述\t创建日期\t截止日期\t优先级\n新品页翻译\t官网\t同步英文文案\t2026-06\t2026-06-01\t高",
    "tasks.importSubmit": "开始导入",
    "tasks.productsTitle": "产品中心",
    "tasks.productNamePh": "产品中心名称",
    "tasks.col.product": "产品中心",
    "tasks.col.description": "任务描述",
    "tasks.col.assignee": "负责人",
    "tasks.col.contact": "对接人",
    "tasks.col.language": "语言",
    "tasks.col.created": "创建日期",
    "tasks.col.deadline": "截止日期",
    "tasks.col.priority": "优先级",
    "tasks.col.progress": "进度",
    "tasks.col.actions": "操作",
    "tasks.noAssignee": "暂无对应语言实习生",
    "tasks.empty": "当前语言暂无任务。",
    "tasks.productsUsed": "{count} 个任务使用",
    "tasks.expand": "展开",
    "tasks.collapseDesc": "收起",
    "taskForm.create": "新建任务",
    "taskForm.edit": "编辑任务",
    "taskForm.title": "任务名称",
    "taskForm.titlePh": "请输入任务名称",
    "taskForm.description": "任务描述",
    "taskForm.descriptionPh": "请输入任务描述",
    "taskForm.product": "产品中心",
    "taskForm.contact": "对接人",
    "taskForm.contactPh": "创建需求的同学",
    "taskForm.deadline": "截止日期",
    "taskForm.priority": "优先级",
    "priority.high": "高",
    "priority.medium": "中",
    "priority.low": "低",
    "priority.highFull": "高优先级",
    "priority.mediumFull": "中优先级",
    "priority.lowFull": "低优先级",
    "knowledge.eyebrow": "本地化维护信息",
    "knowledge.title": "知识库",
    "knowledge.titleWithLang": "知识库 · {lang}",
    "knowledge.langTabs": "知识库语言切换",
    "knowledge.addLang": "＋ 新增语言",
    "knowledge.addEntry": "＋ 新增信息",
    "knowledge.langPh": "语言名称，如：德语、西语",
    "knowledge.cat.preference": "本地化偏好",
    "knowledge.cat.writing": "书写习惯",
    "knowledge.cat.taboo": "禁忌",
    "knowledge.emptyCategory": "当前语言暂无{category}。",
    "knowledge.titlePh": "标题",
    "knowledge.tagPh": "标签",
    "knowledge.submitterPh": "提交者",
    "knowledge.detailPh": "内容说明",
    "knowledge.resourceNote": "{updated}/{count} 条内容已完成最近维护。",
    "reports.eyebrow": "产品 · 语言 · 任务量 · 知识库",
    "reports.title": "仪表盘",
    "reports.byProduct": "按产品统计",
    "reports.byLanguage": "按语言统计",
    "reports.taskVolume": "任务量",
    "reports.knowledgeContrib": "知识库贡献数",
    "reports.totalTasks": "任务总量",
    "reports.activeTasks": "进行中/待处理",
    "reports.highPriority": "高优先级",
    "reports.countItems": "{count} 个",
    "reports.contrib": "{count} 条贡献",
    "reports.noKnowledgeLang": "暂无知识库语言，请先在知识库中添加语言。",
    "guides.eyebrow": "入职与协作",
    "guides.title": "新手指南",
    "guides.create": "＋ 创建文档",
    "guides.upload": "上传文档",
    "guides.uploadHint": "支持 .txt/.md/.doc/.docx/.xls/.xlsx",
    "guides.docTitlePh": "文档标题",
    "guides.docContentPh": "文档内容（支持 Markdown 纯文本）",
    "guides.empty": "暂无新手指南，可创建或上传文档。",
    "guides.typeCreated": "创建",
    "guides.typeUploaded": "上传 · {file}",
    "guides.uploadedFile": "已上传附件：{file}",
    "guides.pin": "置顶",
    "guides.unpin": "取消置顶",
    "lang.en": "英语",
    "lang.ja": "日语",
    "lang.ko": "韩语",
    "lang.fr": "法语",
    "toast.internDeleted": "已删除实习生。",
    "toast.internNameRequired": "请填写实习生姓名。",
    "toast.internUpdated": "实习生信息已更新。",
    "toast.internLangSynced": "实习生语言已更新，相关任务语言已同步。",
    "toast.assigneeUpdated": "负责人已更新。",
    "toast.internLangRequired": "请填写实习生语言。",
    "toast.internAdded": "新实习生已加入。",
    "toast.taskUpdated": "任务已更新。",
    "toast.taskCreated": "新任务已创建。",
    "toast.taskCompleted": "任务已标记为完成。",
    "toast.taskDeleted": "任务已删除。",
    "toast.productInUse": "该产品中心正在被任务使用，不能删除。",
    "toast.productDeleted": "产品中心已删除。",
    "toast.productNameRequired": "请填写产品中心名称。",
    "toast.productExists": "产品中心已存在。",
    "toast.productAdded": "产品中心已新增。",
    "toast.productUpdated": "产品中心已更新。",
    "toast.importPasteRequired": "请先粘贴要导入的任务内容。",
    "toast.importNone": "没有识别到可导入的任务。",
    "toast.imported": "已导入 {count} 个任务。",
    "toast.knowledgeDeleted": "知识库信息已删除。",
    "toast.knowledgeSaved": "知识库信息已保存。",
    "toast.knowledgeRequired": "请填写完整的知识库信息（含提交者）。",
    "toast.langNameRequired": "请填写语言名称。",
    "toast.langAdded": "已添加语言：{label}",
    "toast.guideRequired": "请填写完整的文档标题与内容。",
    "toast.guideUpdated": "新手指南已更新。",
    "toast.guideCreated": "新手指南已创建。",
    "toast.guideDeleted": "新手指南已删除。",
    "toast.guidePinned": "已置顶该文档。",
    "toast.guideUnpinned": "已取消置顶。",
    "toast.fileTooLarge": "文件过大，请上传小于 3MB 的文件。",
    "toast.guideUploaded": "文档已上传。",
    "toast.fileReadFailed": "文档读取失败，请换用文本格式文件。",
    "toast.saveFailed": "数据保存失败，请重试。",
    "toast.syncUpdated": "已同步同事的最新更新。",
    "month.jan": "01月",
    "month.feb": "02月",
    "month.mar": "03月",
    "month.apr": "04月",
    "month.may": "05月",
    "month.jun": "06月",
    "month.jul": "07月",
    "month.aug": "08月",
    "month.sep": "09月",
    "month.oct": "10月",
    "month.nov": "11月",
    "month.dec": "12月",
  },
  en: {
    "app.title": "Translation Intern Manager",
    "brand.title": "Translation Intern Ops",
    "brand.subtitle": "Translation Intern Ops",
    "nav.main": "Main navigation",
    "nav.dashboard": "Overview",
    "nav.tasks": "Tasks",
    "nav.interns": "Interns",
    "nav.knowledge": "Knowledge",
    "nav.reports": "Dashboard",
    "nav.guides": "Guides",
    "nav.dashboardTitle": "Overview",
    "nav.internsTitle": "Intern Management",
    "nav.tasksTitle": "Task Management",
    "nav.knowledgeTitle": "Knowledge Base",
    "nav.reportsTitle": "Dashboard",
    "nav.guidesTitle": "Getting Started",
    "topbar.eyebrow": "Intern development · Translation delivery · Localization",
    "topbar.search": "Search interns, tasks, and knowledge",
    "uiLocale.label": "Interface language",
    "uiLocale.zh": "中文",
    "uiLocale.en": "English",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.collapse": "Collapse",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.add": "Add",
    "common.complete": "Complete",
    "common.completed": "Completed",
    "common.actions": "Actions",
    "common.notSet": "Not set",
    "common.notFilled": "Not provided",
    "common.pending": "TBD",
    "common.entries": "{count} items",
    "common.countUnit": "{count}",
    "common.tasksUnit": "{count} tasks",
    "common.progress": "Progress {percent}%",
    "common.unnamed": "Untitled task",
    "common.addBtn": "Add",
    "intern.editNameAria": "Edit intern name",
    "intern.languageAria": "{name} language",
    "intern.scheduleAria": "{name} schedule",
    "task.assigneeAria": "Assignee for {title}",
    "dashboard.todayEyebrow": "Today's tasks",
    "dashboard.todayTitle": "New tasks today",
    "dashboard.noTasksToday": "No new tasks today.",
    "metrics.interns": "Interns",
    "metrics.activeTasks": "Active tasks",
    "metrics.weeklyTasks": "This week",
    "metrics.knowledge": "Knowledge items",
    "metrics.languageLines": "{count} language lines",
    "metrics.completed": "{count} completed",
    "metrics.weeklyNote": "Created this week",
    "metrics.knowledgeNote": "Prefs / Writing / Taboos",
    "interns.eyebrow": "Basic info",
    "interns.title": "Intern Management",
    "interns.add": "＋ Add",
    "interns.name": "Name",
    "interns.language": "Language",
    "interns.workDays": "Schedule",
    "interns.namePh": "Name",
    "interns.languagePh": "e.g. English, German, Spanish",
    "interns.workDaysPh": "e.g. Mon, Wed, Fri",
    "interns.workDaysEditPh": "e.g. Mon, Wed, Fri",
    "tasks.title": "Task Management",
    "tasks.langTabs": "Language filter",
    "tasks.manageProducts": "Product centers",
    "tasks.import": "Import tasks",
    "tasks.create": "＋ New",
    "tasks.importTitle": "Import tasks",
    "tasks.importPh": "Paste table rows, e.g. Title\tProduct\tDescription\tCreated\tDeadline\tPriority",
    "tasks.importSubmit": "Import",
    "tasks.productsTitle": "Products",
    "tasks.productNamePh": "Product name",
    "tasks.col.product": "Product",
    "tasks.col.description": "Description",
    "tasks.col.assignee": "Assignee",
    "tasks.col.contact": "Requester",
    "tasks.col.language": "Language",
    "tasks.col.created": "Created",
    "tasks.col.deadline": "Deadline",
    "tasks.col.priority": "Priority",
    "tasks.col.progress": "Progress",
    "tasks.col.actions": "Actions",
    "tasks.noAssignee": "No intern for this language",
    "tasks.empty": "No tasks for this language.",
    "tasks.productsUsed": "Used in {count} tasks",
    "tasks.expand": "Expand",
    "tasks.collapseDesc": "Collapse",
    "taskForm.create": "New task",
    "taskForm.edit": "Edit task",
    "taskForm.title": "Task title",
    "taskForm.titlePh": "Enter task title",
    "taskForm.description": "Description",
    "taskForm.descriptionPh": "Enter task description",
    "taskForm.product": "Product",
    "taskForm.contact": "Requester",
    "taskForm.contactPh": "Who submitted the request",
    "taskForm.deadline": "Deadline",
    "taskForm.priority": "Priority",
    "priority.high": "High",
    "priority.medium": "Medium",
    "priority.low": "Low",
    "priority.highFull": "High priority",
    "priority.mediumFull": "Medium priority",
    "priority.lowFull": "Low priority",
    "knowledge.eyebrow": "Localization knowledge",
    "knowledge.title": "Knowledge Base",
    "knowledge.titleWithLang": "Knowledge · {lang}",
    "knowledge.langTabs": "Knowledge language",
    "knowledge.addLang": "＋ Add language",
    "knowledge.addEntry": "＋ Add entry",
    "knowledge.langPh": "Language name, e.g. German",
    "knowledge.cat.preference": "Localization preferences",
    "knowledge.cat.writing": "Writing style",
    "knowledge.cat.taboo": "Taboos",
    "knowledge.emptyCategory": "No {category} for this language.",
    "knowledge.titlePh": "Title",
    "knowledge.tagPh": "Tag",
    "knowledge.submitterPh": "Submitter",
    "knowledge.detailPh": "Details",
    "knowledge.resourceNote": "{updated}/{count} items recently maintained.",
    "reports.eyebrow": "Product · Language · Volume · Knowledge",
    "reports.title": "Dashboard",
    "reports.byProduct": "By product",
    "reports.byLanguage": "By language",
    "reports.taskVolume": "Task volume",
    "reports.knowledgeContrib": "Knowledge contributions",
    "reports.totalTasks": "Total tasks",
    "reports.activeTasks": "In progress / open",
    "reports.highPriority": "High priority",
    "reports.countItems": "{count}",
    "reports.contrib": "{count} contributions",
    "reports.noKnowledgeLang": "Add a knowledge language first.",
    "guides.eyebrow": "Onboarding & collaboration",
    "guides.title": "Getting Started",
    "guides.create": "＋ Create",
    "guides.upload": "Upload file",
    "guides.uploadHint": ".txt / .md / .doc / .docx / .xls / .xlsx",
    "guides.docTitlePh": "Document title",
    "guides.docContentPh": "Content (plain text or Markdown)",
    "guides.empty": "No guides yet. Create or upload a document.",
    "guides.typeCreated": "Created",
    "guides.typeUploaded": "Upload · {file}",
    "guides.uploadedFile": "Uploaded file: {file}",
    "guides.pin": "Pin",
    "guides.unpin": "Unpin",
    "lang.en": "English",
    "lang.ja": "Japanese",
    "lang.ko": "Korean",
    "lang.fr": "French",
    "toast.internDeleted": "Intern removed.",
    "toast.internNameRequired": "Please enter the intern name.",
    "toast.internUpdated": "Intern profile updated.",
    "toast.internLangSynced": "Language updated. Related tasks synced.",
    "toast.assigneeUpdated": "Assignee updated.",
    "toast.internLangRequired": "Please enter a language.",
    "toast.internAdded": "Intern added.",
    "toast.taskUpdated": "Task updated.",
    "toast.taskCreated": "Task created.",
    "toast.taskCompleted": "Task marked complete.",
    "toast.taskDeleted": "Task deleted.",
    "toast.productInUse": "This product center is in use and cannot be deleted.",
    "toast.productDeleted": "Product center deleted.",
    "toast.productNameRequired": "Please enter a product center name.",
    "toast.productExists": "Product center already exists.",
    "toast.productAdded": "Product center added.",
    "toast.productUpdated": "Product center updated.",
    "toast.importPasteRequired": "Paste task content to import.",
    "toast.importNone": "No tasks found to import.",
    "toast.imported": "Imported {count} tasks.",
    "toast.knowledgeDeleted": "Knowledge entry deleted.",
    "toast.knowledgeSaved": "Knowledge entry saved.",
    "toast.knowledgeRequired": "Complete all fields, including submitter.",
    "toast.langNameRequired": "Please enter a language name.",
    "toast.langAdded": "Language added: {label}",
    "toast.guideRequired": "Please enter title and content.",
    "toast.guideUpdated": "Guide updated.",
    "toast.guideCreated": "Guide created.",
    "toast.guideDeleted": "Guide deleted.",
    "toast.guidePinned": "Guide pinned.",
    "toast.guideUnpinned": "Guide unpinned.",
    "toast.fileTooLarge": "File too large. Max 3 MB.",
    "toast.guideUploaded": "Document uploaded.",
    "toast.fileReadFailed": "Could not read file. Try a text-based format.",
    "toast.saveFailed": "Failed to save data. Please try again.",
    "toast.syncUpdated": "Synced latest updates from your team.",
    "month.jan": "Jan",
    "month.feb": "Feb",
    "month.mar": "Mar",
    "month.apr": "Apr",
    "month.may": "May",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Aug",
    "month.sep": "Sep",
    "month.oct": "Oct",
    "month.nov": "Nov",
    "month.dec": "Dec",
  },
};

let uiLocale = "zh";

function loadUiLocale() {
  try {
    const saved = window.localStorage.getItem(I18N_STORAGE_KEY);
    return saved === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function getUiLocale() {
  return uiLocale;
}

function t(key, vars = {}) {
  let text = messages[uiLocale]?.[key] ?? messages.zh[key] ?? key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function displayLanguageLabel(language) {
  if (!language) return "";
  const key = `lang.${language.id}`;
  const translated = messages[uiLocale]?.[key];
  return translated || language.label || language.id;
}

function displayPriority(value) {
  const map = { 高: "priority.high", 中: "priority.medium", 低: "priority.low" };
  return t(map[value] ?? "priority.medium");
}

function displayPriorityOption(value) {
  const map = { 高: "priority.highFull", 中: "priority.mediumFull", 低: "priority.lowFull" };
  return t(map[value] ?? "priority.mediumFull");
}

function monthLabelI18n(date) {
  const month = date.slice(0, 2);
  const keys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const index = Number(month) - 1;
  if (index < 0 || index > 11) return `${month}月`;
  return t(`month.${keys[index]}`);
}

function updateLocalizedSelects() {
  const taskPriority = document.querySelector("#taskForm select[name='priority']");
  if (taskPriority) {
    ["中", "高", "低"].forEach((value) => {
      const option = taskPriority.querySelector(`option[value="${value}"]`);
      if (option) option.textContent = displayPriorityOption(value);
    });
  }

  const knowledgeCategory = document.querySelector("#knowledgeForm select[name='category']");
  if (knowledgeCategory) {
    const cats = [
      ["maintenance", "knowledge.cat.preference"],
      ["resource", "knowledge.cat.writing"],
      ["update", "knowledge.cat.taboo"],
    ];
    cats.forEach(([value, key]) => {
      const option = knowledgeCategory.querySelector(`option[value="${value}"]`);
      if (option) option.textContent = t(key);
    });
  }
}

function syncUiLocaleTabs() {
  const tabs = document.querySelector("#uiLocaleTabs");
  if (!tabs) return;
  tabs.querySelectorAll("[data-ui-locale]").forEach((button) => {
    button.classList.toggle("active", button.dataset.uiLocale === uiLocale);
  });
}

function applyStaticI18n() {
  document.documentElement.lang = uiLocale === "en" ? "en" : "zh-CN";
  document.title = t("app.title");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (element.closest("#uiLocaleTabs")) return;
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  updateLocalizedSelects();
  syncUiLocaleTabs();
}

function setUiLocale(locale) {
  uiLocale = locale === "en" ? "en" : "zh";
  try {
    window.localStorage.setItem(I18N_STORAGE_KEY, uiLocale);
  } catch {
    /* ignore */
  }
  applyStaticI18n();
}

uiLocale = loadUiLocale();
