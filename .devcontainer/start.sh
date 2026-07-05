#!/usr/bin/env bash
# Arranca backend + frontend en segundo plano. Se ejecuta al conectar al
# contenedor (postAttachCommand). Es idempotente: reinicia si ya estaban.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -n "${CODESPACE_NAME:-}" ]; then
  DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  BACKEND_URL="https://${CODESPACE_NAME}-8000.${DOMAIN}"
  FRONTEND_URL="https://${CODESPACE_NAME}-5173.${DOMAIN}"
else
  BACKEND_URL="http://localhost:8000"
  FRONTEND_URL="http://localhost:5173"
fi

# Intento (best-effort) de hacer públicos los puertos en Codespaces.
if command -v gh >/dev/null 2>&1 && [ -n "${CODESPACE_NAME:-}" ]; then
  gh codespace ports visibility 8000:public 5173:public 8080:public \
    -c "$CODESPACE_NAME" >/dev/null 2>&1 || true
fi

# Reinicia procesos previos.
pkill -f "artisan serve" >/dev/null 2>&1 || true
pkill -f "node.*vite"    >/dev/null 2>&1 || true

echo "==> Iniciando backend (:8000) y frontend (:5173)..."
( cd "$ROOT/backend"  && nohup php artisan serve --host=0.0.0.0 --port=8000 \
    > /tmp/sideral-backend.log 2>&1 & )
( cd "$ROOT/frontend" && nohup npm run dev -- --host --port 5173 \
    > /tmp/sideral-frontend.log 2>&1 & )

echo "======================================================================"
echo "   Frontend:  ${FRONTEND_URL}"
echo "   Backend :  ${BACKEND_URL}/api"
echo "   Login    : admin / Admin123!"
echo "   Logs     : /tmp/sideral-backend.log  /tmp/sideral-frontend.log"
echo " Si el login falla, revisa que los puertos 8000 y 5173 estén 'Public'"
echo " en la pestaña PORTS."
echo "======================================================================"
