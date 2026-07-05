#!/usr/bin/env bash
# Setup automático del entorno (backend Laravel + frontend React) para Codespaces.
# Se ejecuta una sola vez al crear el contenedor (postCreateCommand).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# --- URLs (en Codespaces se calculan solas; si no, localhost) ---
if [ -n "${CODESPACE_NAME:-}" ]; then
  DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  BACKEND_URL="https://${CODESPACE_NAME}-8000.${DOMAIN}"
  FRONTEND_URL="https://${CODESPACE_NAME}-5173.${DOMAIN}"
else
  BACKEND_URL="http://localhost:8000"
  FRONTEND_URL="http://localhost:5173"
fi

# Inserta o actualiza KEY=VALUE en un archivo .env
set_env() {
  local file="$1" key="$2" value="$3"
  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

echo "==> Backend: dependencias"
cd "$ROOT/backend"
if command -v composer >/dev/null 2>&1; then
  composer install --no-interaction --prefer-dist
else
  php composer.phar install --no-interaction --prefer-dist
fi

echo "==> Backend: .env"
[ -f .env ] || cp .env.example .env
php artisan key:generate --force

echo "==> Backend: base de datos SQLite"
SQLITE_PATH="$ROOT/backend/database/database.sqlite"
touch "$SQLITE_PATH"
set_env .env DB_CONNECTION sqlite
set_env .env DB_DATABASE "$SQLITE_PATH"
set_env .env APP_URL "$BACKEND_URL"
set_env .env CORS_ALLOWED_ORIGINS "$FRONTEND_URL"

if php -m | grep -qi "pdo_sqlite"; then
  php artisan migrate --seed --force
else
  echo "!! Falta la extensión pdo_sqlite de PHP; no se pudo migrar." >&2
fi

echo "==> Frontend: dependencias y .env"
cd "$ROOT/frontend"
[ -f .env ] || cp .env.example .env
set_env .env VITE_API_URL "${BACKEND_URL}/api"
npm install

echo ""
echo "======================================================================"
echo " Setup completo."
echo "   Backend :  ${BACKEND_URL}"
echo "   Frontend:  ${FRONTEND_URL}"
echo "   Login    : admin / Admin123!"
echo " Recuerda: pon los puertos 8000 y 5173 en visibilidad 'Public'"
echo " (pestaña PORTS) si no se hizo automáticamente."
echo "======================================================================"
