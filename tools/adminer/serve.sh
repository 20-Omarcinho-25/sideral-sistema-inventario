#!/usr/bin/env bash
# Levanta Adminer (panel web tipo phpMyAdmin) en el puerto 8080.
# Uso:  bash tools/adminer/serve.sh
# Luego abre el puerto 8080 (en Codespaces ponlo en visibilidad "Public").
#
# Para conectarte a la BD SQLite del backend, en el formulario de Adminer elige:
#   Motor/System : SQLite 3
#   Servidor     : (dejar vacío)
#   Usuario      : (dejar vacío)
#   Contraseña   : (dejar vacío)
#   Base de datos: la RUTA ABSOLUTA a backend/database/database.sqlite
#                  (ver la ruta impresa abajo)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQLITE_PATH="$(cd "$DIR/../../backend/database" 2>/dev/null && pwd)/database.sqlite"

echo "Adminer:      http://localhost:8080/   (usa index.php: login sin contraseña habilitado)"
echo "SQLite path:  $SQLITE_PATH"
echo "(En Adminer: System=SQLite 3, Database=la ruta de arriba)"
echo
php -S 0.0.0.0:8080 -t "$DIR"
