#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/sync-config.js"

echo "配置团队云端共享（Supabase）"
echo ""
echo "1. 打开 https://supabase.com 创建免费项目"
echo "2. 在 SQL Editor 执行: scripts/setup-supabase.sql"
echo "3. 在 Project Settings → API 复制 Project URL 和 anon public key"
echo ""

read -r -p "Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL
read -r -p "Supabase anon public key: " SUPABASE_ANON_KEY
read -r -p "工作区 ID [translation-intern-ops]: " WORKSPACE_ID
WORKSPACE_ID="${WORKSPACE_ID:-translation-intern-ops}"

cat > "$CONFIG_FILE" <<EOF
const SYNC_CONFIG = {
  enabled: true,
  url: "${SUPABASE_URL}",
  anonKey: "${SUPABASE_ANON_KEY}",
  workspaceId: "${WORKSPACE_ID}",
};
EOF

echo ""
echo "已写入 sync-config.js（enabled: true）"
echo "接下来: git add sync-config.js && git commit && git push"
echo "然后把 GitHub Pages 链接发给同事，首次访问设置团队密码即可。"
