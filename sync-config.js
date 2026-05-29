// 本地开发默认关闭团队同步。
// 生产环境：在 GitHub 仓库 Settings → Secrets → Actions 添加
//   SUPABASE_URL、SUPABASE_ANON_KEY
// 推送后 Actions 会自动生成本文件并开启同步。
// 也可运行: ./scripts/setup-cloud-sync.sh
const SYNC_CONFIG = {
  enabled: false,
  url: "",
  anonKey: "",
  workspaceId: "translation-intern-ops",
};
