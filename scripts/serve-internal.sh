#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8080}"
HOST="${HOST:-0.0.0.0}"

cd "$ROOT_DIR"

IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo 127.0.0.1)"

echo "启动内网访问服务..."
echo "本机访问: http://127.0.0.1:${PORT}/"
echo "局域网访问: http://${IP}:${PORT}/"
echo ""
echo "默认访问密码: InternOps2026"
echo "可在 auth.js 中修改密码哈希。"
echo ""

python3 -m http.server "$PORT" --bind "$HOST"
