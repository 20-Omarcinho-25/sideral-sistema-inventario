@echo off
setlocal enabledelayedexpansion
title Instalador Sideral - AIReady (Portable + SQLite)
color 0A

REM ============================================================
REM  INSTALADOR AUTOMATICO (ejecutar UNA sola vez)
REM
REM  Usa SQLite por defecto: NO necesita MySQL, ni puerto 3306,
REM  ni contrasena de root. A prueba de errores en cualquier PC.
REM
REM  Estructura de carpetas esperada (todo portable):
REM   Proyecto-AIReady-Portable\
REM     node\   (o node-vXX-win-x64\)   -> tu Node.js portable
REM     xampp\                          -> tu XAMPP portable (trae PHP)
REM     sideral-sistema-inventario\     -> el repo (aqui vive este .bat)
REM
REM  NO uses rutas con espacios en el nombre de las carpetas.
REM ============================================================

set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
for %%I in ("%REPO%\..") do set "BASE=%%~fI"

set "XAMPP=%BASE%\xampp"
set "PHP=%XAMPP%\php"

REM --- Detectar carpeta de Node (node\ o node-*\) ---
set "NODE="
if exist "%BASE%\node\node.exe" set "NODE=%BASE%\node"
if not defined NODE for /d %%D in ("%BASE%\node*") do if exist "%%D\node.exe" set "NODE=%%D"

echo ============================================
echo  Carpeta base : %BASE%
echo  XAMPP/PHP    : %PHP%
echo  Node.js      : %NODE%
echo ============================================
echo.

if not exist "%PHP%\php.exe" (
  echo [ERROR] No se encontro PHP en "%PHP%".
  echo         Copia tu XAMPP portable en "%XAMPP%".
  pause & exit /b 1
)
if not defined NODE (
  echo [ERROR] No se encontro Node.js. Copia tu carpeta "node" en "%BASE%".
  pause & exit /b 1
)

set "PATH=%PHP%;%NODE%;%PATH%"

REM --- Ajustar rutas internas de XAMPP portable a ESTA PC (una vez) ---
REM Corrige rutas absolutas viejas (p.ej. de otra PC/usuario) en php.ini y demas.
if exist "%XAMPP%\setup_xampp.bat" (
  echo Ajustando rutas internas de XAMPP portable a esta PC...
  pushd "%XAMPP%"
  echo. | call setup_xampp.bat >nul 2>&1
  popd
)

echo ============================================
echo  Configurando php.ini para esta PC...
echo ============================================
REM 1) Fija extension_dir a la carpeta ext de ESTA PC (evita rutas de otra maquina)
REM 2) Descomenta las extensiones que necesita Laravel + Composer + SQLite
REM 3) Desactiva browscap (evita el warning por ruta absoluta vieja)
powershell -NoProfile -Command ^
  "$ini = Join-Path '%PHP%' 'php.ini';" ^
  "if (-not (Test-Path $ini)) { $dev = Join-Path '%PHP%' 'php.ini-development'; if (Test-Path $dev) { Copy-Item $dev $ini } };" ^
  "if (Test-Path $ini) {" ^
  "  $extdir = (Join-Path '%PHP%' 'ext');" ^
  "  $exts = 'zip','openssl','curl','fileinfo','mbstring','pdo_sqlite','sqlite3','pdo_mysql','gd';" ^
  "  $c = Get-Content $ini;" ^
  "  $c = $c -replace '^\s*;?\s*extension_dir\s*=.*', ('extension_dir=\"' + $extdir + '\"');" ^
  "  $c = $c -replace '^\s*browscap\s*=.*', ';browscap=';" ^
  "  foreach ($e in $exts) { $c = $c -replace ('^\s*;\s*extension\s*=\s*' + [regex]::Escape($e) + '\s*$'), ('extension=' + $e) }" ^
  "  Set-Content $ini $c;" ^
  "  Write-Host ('php.ini actualizado. extension_dir=' + $extdir)" ^
  "} else { Write-Host '[ADVERTENCIA] No se encontro php.ini' }"

echo.
echo Versiones detectadas:
php -v
node -v
call npm -v
echo.

echo ============================================
echo  Configurando BACKEND (Laravel + SQLite)...
echo ============================================
cd /d "%REPO%\backend"
if not exist ".env" copy ".env.example" ".env" >nul

REM Forzar SQLite y comentar variables de MySQL en el .env
powershell -NoProfile -Command ^
  "$f = '.env'; $c = Get-Content $f;" ^
  "$c = $c -replace '^DB_CONNECTION=.*','DB_CONNECTION=sqlite';" ^
  "foreach ($k in 'DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD') { $c = $c -replace ('^' + $k + '='), ('#' + $k + '=') }" ^
  "Set-Content $f $c"

REM Crear el archivo de base de datos SQLite si no existe
if not exist "database\database.sqlite" (
  type nul > "database\database.sqlite"
  echo Base SQLite creada: backend\database\database.sqlite
)

echo Instalando dependencias PHP (composer)... (puede tardar)
if exist "composer.phar" (
  php composer.phar install --no-interaction --prefer-dist
) else (
  call composer install --no-interaction --prefer-dist
)

if not exist "vendor\autoload.php" (
  echo [ERROR] Composer no genero la carpeta vendor.
  echo         Revisa que 'extension=zip' este activa en %PHP%\php.ini y vuelve a ejecutar.
  pause & exit /b 1
)

php artisan key:generate --force
php artisan config:clear
echo Ejecutando migraciones + datos de prueba...
php artisan migrate --seed --force

echo.
echo ============================================
echo  Configurando FRONTEND (React / Vite)...
echo ============================================
cd /d "%REPO%\frontend"
if exist ".env" del ".env" >nul
call npm install

echo.
echo ============================================
echo   INSTALACION COMPLETA (base de datos: SQLite)
echo   Usuarios de prueba:
echo     admin    / Admin123!
echo     vendedor / Vendedor123!
echo.
echo   Ahora ejecuta:  iniciar-sideral.bat
echo ============================================
pause
endlocal
