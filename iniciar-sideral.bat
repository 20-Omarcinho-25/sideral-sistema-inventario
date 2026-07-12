@echo off
setlocal enabledelayedexpansion
title Sideral - AIReady (PC como SERVIDOR)
color 0B

REM ============================================================
REM  ARRANQUE DEL SISTEMA (doble clic para iniciar el servidor)
REM  Levanta: API Laravel (8000) + Frontend Vite (5173).
REM  Base de datos: SQLite (no requiere arrancar MySQL).
REM  Detecta tu IP de la red (hotspot) para servir a otros equipos.
REM ============================================================

set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
for %%I in ("%REPO%\..") do set "BASE=%%~fI"

set "XAMPP=%BASE%\xampp"
set "PHP=%XAMPP%\php"

set "NODE="
if exist "%BASE%\node\node.exe" set "NODE=%BASE%\node"
if not defined NODE for /d %%D in ("%BASE%\node*") do if exist "%%D\node.exe" set "NODE=%%D"

if not exist "%PHP%\php.exe" ( echo [ERROR] No se encontro PHP en "%PHP%". & pause & exit /b 1 )
if not defined NODE ( echo [ERROR] No se encontro Node.js en "%BASE%". & pause & exit /b 1 )

set "PATH=%PHP%;%NODE%;%PATH%"

REM --- Detectar IP de la red local (hotspot / LAN) solo para informar ---
REM NOTA: el frontend arma la URL de la API con el MISMO host desde el que se
REM abre (ver frontend/src/app/lib/api.ts), asi que NO se fuerza VITE_API_URL.
REM Asi funciona igual en localhost y desde el celular por el hotspot.
set "LANIP="
for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } ^| Select-Object -First 1 -ExpandProperty IPAddress"') do set "LANIP=%%i"

REM --- Backend (API Laravel) ---
start "Backend Laravel :8000" cmd /k "cd /d %REPO%\backend && php artisan serve --host=0.0.0.0 --port=8000"

REM --- Frontend (React / Vite) ---
start "Frontend Vite :5173" cmd /k "cd /d %REPO%\frontend && npm run dev -- --host --port 5173"

timeout /t 8 >nul
start http://localhost:5173

echo.
echo ============================================
echo   SERVIDOR EN LINEA
echo   Este equipo (servidor) : http://localhost:5173
if defined LANIP echo   Otros equipos (hotspot): http://%LANIP%:5173
echo   Usuarios: admin / Admin123!   |   vendedor / Vendedor123!
echo.
echo   Deja esta ventana abierta mientras uses el sistema.
echo ============================================
pause
endlocal
