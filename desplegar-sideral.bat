@echo off
setlocal enabledelayedexpansion
title Asistente de Despliegue - Persona 3 (Apache)
color 0E

echo ============================================================
echo   ASISTENTE AUTOMATICO DE DESPLIEGUE EN PC DEL PROFESOR
echo ============================================================
echo.
echo   Este script realizara las siguientes tareas en esta PC:
echo   1. Copiara el sistema a C:\xampp\htdocs\aiready
echo   2. Configurara php.ini con las extensiones necesarias
echo   3. Configurara el entorno de produccion y base de datos
echo   4. Instalara dependencias PHP de produccion
echo   5. Inicializara los datos del sistema
echo.
echo   REQUISITOS PREVIOS:
echo   - Tener XAMPP instalado en C:\xampp o portable
echo   - Tener Apache encendido en el Panel de XAMPP
echo.

set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
for %%I in ("%REPO%\..") do set "BASE=%%~fI"

REM --- Detectar la ruta de PHP de XAMPP ---
set "XAMPP=%BASE%\xampp"
set "PHP=%XAMPP%\php"

if not exist "%PHP%\php.exe" (
    if exist "C:\xampp\php\php.exe" (
        set "XAMPP=C:\xampp"
        set "PHP=C:\xampp\php"
    ) else (
        where.exe php.exe >nul 2>&1
        if !errorlevel! equ 0 (
            for /f "delims=" %%I in ('where.exe php.exe') do set "PHP_PATH=%%~dpI"
            set "PHP=!PHP_PATH:~0,-1!"
            set "XAMPP=!PHP!\.."
        )
    )
)

if not exist "!PHP!\php.exe" (
    echo [ERROR] No se encontro PHP en la ruta de XAMPP ni en el sistema.
    pause
    exit /b 1
)

echo.
echo Usando PHP desde: !PHP!

echo.
echo [1/5] Copiando archivos al servidor Apache (htdocs)...
xcopy /E /I /Y "%REPO%\backend" "!XAMPP!\htdocs\aiready\backend" >nul
if !errorlevel! neq 0 (
    echo [ERROR] No se pudieron copiar los archivos a htdocs. Ejecuta este script como Administrador si es necesario.
    pause
    exit /b 1
)
echo Carpeta copiada con exito en !XAMPP!\htdocs\aiready

echo.
echo [2/5] Configurando php.ini para habilitar extensiones necesarias...
powershell -NoProfile -Command ^
  "$ini = Join-Path '!PHP!' 'php.ini';" ^
  "if (-not (Test-Path $ini)) { $dev = Join-Path '!PHP!' 'php.ini-development'; if (Test-Path $dev) { Copy-Item $dev $ini } };" ^
  "if (Test-Path $ini) {" ^
  "  $extdir = (Join-Path '!PHP!' 'ext');" ^
  "  $exts = 'zip','openssl','curl','fileinfo','mbstring','pdo_sqlite','sqlite3','gd';" ^
  "  $c = Get-Content $ini;" ^
  "  $c = $c -replace '^\s*;?\s*extension_dir\s*=.*', ('extension_dir=\"' + $extdir + '\"');" ^
  "  $c = $c -replace '^\s*browscap\s*=.*', ';browscap=';" ^
  "  foreach ($e in $exts) { $c = $c -replace ('^\s*;\s*extension\s*=\s*' + [regex]::Escape($e) + '\s*$'), ('extension=' + $e) }" ^
  "  Set-Content $ini $c;" ^
  "  Write-Host 'php.ini configurado correctamente.'" ^
  "} else { Write-Host '[ADVERTENCIA] No se encontro php.ini para configurar' }"

echo.
echo [3/5] Configurando archivo de entorno de datos (.env)...
cd /d "!XAMPP!\htdocs\aiready\backend"
if not exist ".env" copy ".env.example" ".env" >nul

REM Configurar SQLite de forma silenciosa bajo el capó
powershell -NoProfile -Command ^
  "$f = '.env'; $c = Get-Content $f;" ^
  "$c = $c -replace '^APP_ENV=.*','APP_ENV=production';" ^
  "$c = $c -replace '^APP_DEBUG=.*','APP_DEBUG=false';" ^
  "$c = $c -replace '^DB_CONNECTION=.*','DB_CONNECTION=sqlite';" ^
  "foreach ($k in 'DB_HOST','DB_PORT','DB_DATABASE','DB_USERNAME','DB_PASSWORD') { $c = $c -replace ('^' + $k + '='), ('#' + $k + '=') }" ^
  "Set-Content $f $c"
  
REM Crear base de datos silenciosa si no existe en htdocs
if not exist "database\database.sqlite" (
    type nul > "database\database.sqlite"
)

echo Entorno configurado con exito.

echo.
echo [4/5] Instalando dependencias PHP (Composer)...
if exist "composer.phar" (
    "!PHP!\php.exe" composer.phar install --no-dev --optimize-autoloader --no-interaction
) else (
    echo [ADVERTENCIA] No se encontro composer.phar, intentando usar composer global...
    call composer install --no-dev --optimize-autoloader --no-interaction
)

echo Generando clave de aplicacion...
"!PHP!\php.exe" artisan key:generate --force

echo.
echo [5/5] Ejecutando migraciones y seeders de datos...
"!PHP!\php.exe" artisan config:clear
"!PHP!\php.exe" artisan migrate --seed --force

REM --- Obtener la IP local ---
set "LANIP="
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex (Get-NetConnectionProfile).InterfaceIndex).IPAddress"') do set "LANIP=%%i"

echo.
echo ============================================================
echo   ¡DESPLIEGUE COMPLETADO CON EXITO!
echo.
echo   - Acceso en el servidor: http://localhost/aiready/backend/public/app/
if defined LANIP (
echo   - Acceso en red local:   http://!LANIP!/aiready/backend/public/app/
)
echo   - Usuarios de prueba: admin / Admin123! o vendedor / Vendedor123!
echo ============================================================
echo.
pause
endlocal
