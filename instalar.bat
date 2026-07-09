@echo off
setlocal enabledelayedexpansion
title Instalador Sideral - AIReady (Portable + MySQL/XAMPP)
color 0A

REM ============================================================
REM  INSTALADOR AUTOMATICO (ejecutar UNA sola vez)
REM
REM  Estructura de carpetas esperada (todo portable):
REM   Proyecto-AIReady-Portable\
REM     node\   (o node-vXX-win-x64\)   -> tu Node.js portable
REM     xampp\                          -> tu XAMPP portable (PHP + MySQL)
REM     sideral-sistema-inventario\     -> el repo (aqui vive este .bat)
REM
REM  NO uses rutas con espacios en el nombre de las carpetas.
REM ============================================================

REM --- Ubicacion del repo y de la carpeta base (un nivel arriba) ---
set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
for %%I in ("%REPO%\..") do set "BASE=%%~fI"

set "XAMPP=%BASE%\xampp"
set "PHP=%XAMPP%\php"
set "MYSQLBIN=%XAMPP%\mysql\bin"

REM --- Detectar carpeta de Node (node\ o node-*\) ---
set "NODE="
if exist "%BASE%\node\node.exe" set "NODE=%BASE%\node"
if not defined NODE for /d %%D in ("%BASE%\node*") do if exist "%%D\node.exe" set "NODE=%%D"

echo ============================================
echo  Carpeta base : %BASE%
echo  XAMPP        : %XAMPP%
echo  PHP          : %PHP%
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

set "PATH=%PHP%;%NODE%;%MYSQLBIN%;%PATH%"

echo Versiones detectadas:
php -v
node -v
call npm -v
echo.

REM --- Ajustar rutas internas de XAMPP portable (una vez) ---
if exist "%XAMPP%\setup_xampp.bat" (
  echo Ajustando rutas internas de XAMPP portable...
  pushd "%XAMPP%"
  echo. | call setup_xampp.bat >nul 2>&1
  popd
)

echo.
echo ============================================
echo  Iniciando MySQL (XAMPP)...
echo ============================================
tasklist /fi "imagename eq mysqld.exe" | find /i "mysqld.exe" >nul
if errorlevel 1 (
  start "MySQL" /b "%MYSQLBIN%\mysqld.exe" --defaults-file="%MYSQLBIN%\my.ini" --standalone
  echo Esperando a que MySQL levante...
  timeout /t 10 >nul
) else (
  echo MySQL ya estaba corriendo.
)

echo Creando base de datos 'laravel' (si no existe)...
"%MYSQLBIN%\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
  echo [ADVERTENCIA] No se pudo crear la BD automaticamente.
  echo               Abrela manualmente en http://localhost/phpmyadmin
)

echo.
echo ============================================
echo  Configurando BACKEND (Laravel + MySQL)...
echo ============================================
cd /d "%REPO%\backend"
if not exist ".env" copy ".env.example" ".env" >nul

REM Forzar conexion MySQL en el .env
powershell -NoProfile -Command "(Get-Content .env) -replace '^DB_CONNECTION=.*','DB_CONNECTION=mysql' -replace '^DB_DATABASE=.*','DB_DATABASE=laravel' -replace '^DB_USERNAME=.*','DB_USERNAME=root' -replace '^DB_PASSWORD=.*','DB_PASSWORD=' | Set-Content .env"

echo Instalando dependencias PHP (composer)... (puede tardar)
if exist "composer.phar" (
  php composer.phar install --no-interaction --prefer-dist
) else (
  call composer install --no-interaction --prefer-dist
)

php artisan key:generate --force
echo Ejecutando migraciones + datos de prueba...
php artisan migrate --seed --force

echo.
echo ============================================
echo  Configurando FRONTEND (React / Vite)...
echo ============================================
cd /d "%REPO%\frontend"
call npm install

echo.
echo ============================================
echo   INSTALACION COMPLETA
echo   Usuarios de prueba:
echo     admin    / Admin123!
echo     vendedor / Vendedor123!
echo.
echo   Ahora ejecuta:  iniciar-sideral.bat
echo ============================================
pause
endlocal
