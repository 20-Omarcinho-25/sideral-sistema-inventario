# Despliegue local (Windows) — Sideral / AIReady

Guía para levantar el sistema con tu PC como **servidor**, usando versiones
**portables** (Node.js + XAMPP para PHP). La base de datos por defecto es
**SQLite**, que es lo más "a prueba de errores" para varias PCs: no necesita
arrancar MySQL, ni puerto 3306, ni contraseña de root. Funciona aunque el equipo
no tenga nada instalado y aunque la red universitaria bloquee puertos (se usa el
**hotspot del celular**).

## Arquitectura (servidor vs cliente)

| Componente | Dónde corre | Puerto |
|---|---|---|
| API Laravel (PHP) | Servidor (tu PC) | 8000 |
| Base de datos SQLite (archivo) | Servidor (tu PC) | — (archivo, sin puerto) |
| Frontend React/Vite | Servidor lo sirve; corre en el navegador del cliente | 5173 |

El **servidor** es tu PC. Los **clientes** (tu navegador y/o el celular u otros
equipos del hotspot) entran por el navegador.

## Estructura de carpetas (portable, sin espacios en las rutas)

```
Proyecto-AIReady-Portable\
├─ node\                        (Node.js portable — o node-vXX-win-x64\)
├─ xampp\                       (XAMPP portable: trae PHP 8.2)
└─ sideral-sistema-inventario\  (este repo, rama VERSION-PRUEBA)
   ├─ instalar.bat            <- ejecutar UNA vez
   ├─ iniciar-sideral.bat     <- ejecutar cada vez que uses el sistema
   ├─ backend\
   └─ frontend\
```

## Versiones recomendadas

- **XAMPP 8.2.x** (trae PHP 8.2, ideal para Laravel 9). No hace falta usar su MySQL.
- **Node.js 20 LTS o 22** (Vite 6 requiere Node 18+). npm viene incluido.
- **Composer**: ya incluido en `backend\composer.phar` (no descargas nada).

## Instalación (una sola vez)

1. Copia `node`, `xampp` y este repo dentro de `Proyecto-AIReady-Portable\`.
2. Asegúrate de estar en la rama correcta (Git Bash dentro del repo):
   ```bash
   git remote get-url origin || git remote add origin https://github.com/20-Omarcinho-25/sideral-sistema-inventario.git
   git fetch origin
   git checkout VERSION-PRUEBA || git checkout -b VERSION-PRUEBA origin/VERSION-PRUEBA
   git pull
   ```
3. Doble clic en **`instalar.bat`**. Este script (automático):
   - Detecta tu Node y XAMPP portables y arma el PATH.
   - **Activa solo** las extensiones de PHP necesarias en `xampp\php\php.ini`
     (`zip`, `openssl`, `curl`, `fileinfo`, `mbstring`, `pdo_sqlite`, `sqlite3`, ...).
   - Copia `.env` y lo deja en **SQLite**, y crea `backend\database\database.sqlite`.
   - Corre `composer install`, `key:generate`, `config:clear`, `migrate --seed` y `npm install`.

Usuarios que crea:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123!` | Administrador |
| `vendedor` | `Vendedor123!` | Vendedor |

## Uso diario (arrancar el servidor)

Doble clic en **`iniciar-sideral.bat`**. Este script:
- Arma el PATH portable.
- Detecta la IP de tu red (hotspot) solo para mostrártela.
- Levanta la API Laravel (`0.0.0.0:8000`) y el frontend Vite (`0.0.0.0:5173`).
- Abre el navegador en `http://localhost:5173`.

No arranca MySQL porque con SQLite no hace falta.

### Acceso

- Desde la **misma PC**: `http://localhost:5173`
- Desde el **celular u otro equipo** del hotspot: `http://<IP-de-tu-PC>:5173`
  (el script te muestra la IP; también con `ipconfig` → IPv4).

El frontend arma la URL de la API con el **mismo host** desde el que se abre, así
que funciona igual en `localhost` y por la IP del hotspot sin configurar nada.

## Red / puertos (hotspot)

- Si demuestras **todo en la misma PC**, usa `localhost`: la red no interviene y el
  bloqueo de puertos de la universidad **no afecta**.
- Para acceder desde **otros dispositivos**, conéctalos al **hotspot del celular** y:
  1. Abre los puertos **8000** y **5173** en el Firewall de Windows
     (Reglas de entrada → Nueva regla → Puerto → TCP).
  2. El CORS ya acepta cualquier IP privada en el puerto 5173 (ver `backend/config/cors.php`).

## ¿Y si quiero usar MySQL en vez de SQLite?

1. Inicia MySQL en el panel de XAMPP y crea la base `laravel` en `http://localhost/phpmyadmin`.
2. En `backend\.env` comenta `DB_CONNECTION=sqlite` y descomenta/ajusta las
   líneas `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`,
   `DB_PASSWORD` (pon la contraseña real de tu root).
3. `php artisan config:clear` y `php artisan migrate --seed`.

## Arranque automático al encender Windows (opcional)

Crea un acceso directo de `iniciar-sideral.bat` y pégalo en la carpeta que abre
`Win+R` → `shell:startup`.

## Problemas frecuentes

- **`vendor/autoload.php not found` / composer falla con "zip extension missing"**:
  falta activar `extension=zip` en `xampp\php\php.ini`. `instalar.bat` ya lo hace;
  si lo editas a mano, vuelve a correr `php composer.phar install`.
- **"Error de conexión con el servidor" en el login**: el backend no está corriendo;
  mira la ventana "Backend Laravel". Confirma que exista `backend\vendor\`.
- **`Access denied for user 'root'`** o **`Port 3306 in use`**: son problemas de MySQL;
  con SQLite (por defecto) no aparecen. Asegúrate de tener `DB_CONNECTION=sqlite` y
  corre `php artisan config:clear`.
- **El celular no carga datos**: verifica que ambos estén en el hotspot, el Firewall
  permita 8000 y 5173, y que entres por `http://<IP>:5173`.
