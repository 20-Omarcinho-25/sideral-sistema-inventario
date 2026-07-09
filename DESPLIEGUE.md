# Despliegue local (Windows 10) — Sideral / AIReady

Guía para levantar el sistema con tu PC actuando como **servidor**, usando
versiones **portables** (Node.js + XAMPP) y **MySQL** como base de datos
principal. Pensado para funcionar aunque el equipo de la universidad no tenga
nada instalado y aunque la red universitaria bloquee puertos (se usa el
**hotspot del celular**).

## Arquitectura (servidor vs cliente)

| Componente | Dónde corre | Puerto |
|---|---|---|
| API Laravel (PHP) | Servidor (tu PC) | 8000 |
| Base de datos MySQL (XAMPP) | Servidor (tu PC) | 3306 |
| Frontend React/Vite | Servidor sirve, corre en el navegador del cliente | 5173 |

El **servidor** es tu PC. Los **clientes** (tu propio navegador y/o el celular u
otros equipos del hotspot) entran por el navegador.

## Estructura de carpetas (portable)

Todo dentro de una sola carpeta, sin espacios en las rutas:

```
C:\Users\Omar\Documents\Proyecto-AIReady-Portable\
├─ node\                       (Node.js portable — o node-vXX-win-x64\)
├─ xampp\                      (XAMPP portable: PHP 8.2 + MySQL)
└─ sideral-sistema-inventario\ (este repo)
   ├─ instalar.bat            <- ejecutar UNA vez
   ├─ iniciar-sideral.bat     <- ejecutar cada vez que uses el sistema
   ├─ backend\
   └─ frontend\
```

## Versiones recomendadas

- **XAMPP 8.2.x** (trae PHP 8.2 + MySQL/MariaDB). PHP 8.2 es el ideal para Laravel 9.
- **Node.js 20 LTS o 22** (Vite 6 requiere Node 18+). npm viene incluido.
- **Composer**: ya incluido en `backend\composer.phar` (no descargas nada).
- **MySQL**: el que trae XAMPP.

## Instalación (una sola vez)

1. Copia `node`, `xampp` y este repo dentro de `Proyecto-AIReady-Portable\`.
2. (Solo XAMPP portable) La primera vez, entra a la carpeta `xampp` y ejecuta
   `setup_xampp.bat` para que ajuste sus rutas internas. `instalar.bat` también
   intenta hacerlo automáticamente.
3. Doble clic en **`instalar.bat`**. Este script:
   - Detecta tu Node y XAMPP portables.
   - Arranca MySQL y crea la base de datos `laravel`.
   - Copia `.env` y lo deja configurado en **MySQL**.
   - Instala dependencias (`composer install` + `npm install`).
   - Crea las tablas y los usuarios de prueba (`migrate --seed`).

Usuarios que crea:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123!` | Administrador |
| `vendedor` | `Vendedor123!` | Vendedor |

## Uso diario

Doble clic en **`iniciar-sideral.bat`**. Este script:
- Arranca MySQL (si no está corriendo).
- Detecta la **IP de tu red** (hotspot) y configura el frontend para apuntar a ella.
- Levanta la API Laravel (`0.0.0.0:8000`) y el frontend Vite (`0.0.0.0:5173`).
- Abre el navegador en `http://localhost:5173`.

### Acceso

- Desde la **misma PC**: `http://localhost:5173`
- Desde el **celular u otro equipo** del hotspot: `http://<IP-de-tu-PC>:5173`
  (el script te muestra la IP; también la ves con `ipconfig` → IPv4).

## Red / puertos (hotspot)

- Si demuestras **todo en la misma PC**, usa `localhost`: la red no interviene y
  el bloqueo de puertos de la universidad **no afecta**.
- Para acceder desde **otros dispositivos**, conéctalos al **hotspot del celular**
  (evita el firewall de la universidad). Además:
  1. Abre los puertos **8000** y **5173** en el Firewall de Windows
     (Reglas de entrada → Nueva regla → Puerto → TCP).
  2. El CORS ya acepta cualquier IP privada en el puerto 5173
     (ver `backend/config/cors.php`), así que no hay que editar nada por dispositivo.

## Arranque automático al encender Windows (opcional)

Crea un acceso directo de `iniciar-sideral.bat` y pégalo en la carpeta que abre
`Win+R` → `shell:startup`.

## Problemas frecuentes

- **`php` o `node` no se reconoce**: revisa que las carpetas `xampp` y `node`
  estén dentro de `Proyecto-AIReady-Portable\`. Los `.bat` arman el PATH solos.
- **MySQL no arranca**: ejecuta `xampp\setup_xampp.bat` una vez; verifica que el
  puerto 3306 esté libre.
- **El celular no carga datos**: confirma que ambos estén en el hotspot, que el
  Firewall permita 8000 y 5173, y que estés entrando por `http://<IP>:5173`.
