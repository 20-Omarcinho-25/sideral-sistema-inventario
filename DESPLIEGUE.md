# Guía de despliegue — Sistema Sideral (backend + frontend)

Este proyecto tiene dos partes que deben quedar **sincronizadas**:

- `backend/` — API Laravel (PHP + MySQL)
- `frontend/` — SPA React + Vite

El frontend **no** debe apuntar a `localhost` de forma fija: lee la variable
`VITE_API_URL`. El backend solo acepta peticiones desde los orígenes listados en
`CORS_ALLOWED_ORIGINS`. Configurando esas dos variables el login funciona en
cualquier escenario.

Credenciales sembradas (seeder):

| Usuario   | Contraseña    | Rol      |
|-----------|---------------|----------|
| `admin`   | `Admin123!`   | admin    |
| `vendedor`| `Vendedor123!`| vendedor |

---

## 1. Backend (una sola vez)

```bash
cd backend
cp .env.example .env          # crear el .env
# Edita .env: DB_DATABASE, DB_USERNAME, DB_PASSWORD (MySQL)
composer install
php artisan key:generate      # genera APP_KEY (obligatorio)
php artisan migrate --seed    # crea tablas y usuarios de prueba
```

Levantar el servidor:

```bash
# Accesible desde otras máquinas de la red (no solo localhost):
php artisan serve --host=0.0.0.0 --port=8000
```

## 2. Frontend (una sola vez)

```bash
cd frontend
cp .env.example .env          # crear el .env
# Edita VITE_API_URL según el escenario (ver abajo)
pnpm install
pnpm dev                      # desarrollo (puerto 5173)
# o para producción:
pnpm build && pnpm preview --host --port 5173
```

> Importante: Vite "hornea" `VITE_API_URL` en el build. Si cambias la URL,
> vuelve a ejecutar `pnpm build` (o reinicia `pnpm dev`).

---

## Escenarios

### A) Todo en una sola PC (demo académica) — el más simple y a prueba de fallos
No depende de la red. Frontend y backend en la misma máquina.

- `frontend/.env`: `VITE_API_URL=http://localhost:8000/api`
- `backend/.env`: `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`

### B) Varios dispositivos en la MISMA red (LAN universitaria)
Otros equipos entran usando la **IP local** de la PC que corre el backend.
Averigua la IP con `ipconfig` (Windows) o `ip addr` (Linux/Mac), p. ej. `192.168.1.50`.

- Backend: `php artisan serve --host=0.0.0.0 --port=8000`
- `frontend/.env`: `VITE_API_URL=http://192.168.1.50:8000/api`
- `backend/.env`: `CORS_ALLOWED_ORIGINS=http://192.168.1.50:5173`
- Sirve el frontend accesible: `pnpm dev --host` (o `pnpm preview --host`).
- Abre el firewall de la PC para los puertos 8000 y 5173.

> ⚠️ Muchas redes WiFi universitarias tienen "aislamiento de clientes"
> (client isolation) que bloquea la comunicación entre dispositivos. Si otros
> equipos no logran conectar aunque el firewall esté abierto, usa el escenario C.

### C) Túnel público (funciona detrás de casi cualquier red universitaria)
Expone el backend local a Internet con una URL pública temporal.

Con Cloudflare Tunnel (gratis, sin cuenta):
```bash
cloudflared tunnel --url http://localhost:8000
```
o con ngrok:
```bash
ngrok http 8000
```
Copia la URL pública que te dé (p. ej. `https://algo.trycloudflare.com`) y:

- `frontend/.env`: `VITE_API_URL=https://algo.trycloudflare.com/api`
- `backend/.env`: `CORS_ALLOWED_ORIGINS=<URL pública del frontend>`
  (si también expones el frontend por túnel, usa esa URL).
- Vuelve a `pnpm build` el frontend tras fijar la URL.

### D) GitHub Codespaces (recomendado para pruebas académicas)

**Opción automática (recomendada):** el repo incluye `.devcontainer/`. Al crear
un Codespace (o al hacer "Rebuild Container" en uno existente) se instala todo,
se configura SQLite, se corre `migrate --seed` y se arrancan backend y frontend
solos, con las URLs de Codespaces ya puestas en `VITE_API_URL` y CORS.
Solo asegúrate de que los puertos **8000** y **5173** queden en visibilidad
**Public** (pestaña PORTS) — el devcontainer lo intenta automáticamente, pero
según la configuración de tu organización quizá debas ponerlos a mano.

Si prefieres hacerlo manual, sigue los pasos de abajo. En Codespaces el navegador
NO usa `localhost`, sino las **URLs reenviadas** que aparecen en la pestaña
**PORTS**.

**Backend (usando SQLite, sin servidor de BD):**
```bash
cd backend
php composer.phar install     # el repo trae composer.phar; o usa: composer install
cp .env.example .env
php artisan key:generate
```
Edita `backend/.env` y usa SQLite:
```env
DB_CONNECTION=sqlite
# comenta/borra DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```
```bash
touch database/database.sqlite
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

**Puertos:** en la pestaña PORTS pon **8000** (backend) y **5173** (frontend) en
visibilidad **Public** (clic derecho → Port Visibility → Public). Si quedan
"Private", el navegador recibe la página de login de GitHub en vez de la API.

**Frontend:**
- `frontend/.env`: `VITE_API_URL=https://TU-CODESPACE-8000.app.github.dev/api`
  (copia la URL exacta del puerto 8000 desde PORTS y agrégale `/api`).
```bash
cd frontend && npm install && npm run dev -- --host
```
- `backend/.env`: `CORS_ALLOWED_ORIGINS=https://TU-CODESPACE-5173.app.github.dev`

---

## Panel de base de datos (Adminer, tipo phpMyAdmin)

El repo incluye Adminer en `tools/adminer/` para ver tablas y registros por web.

```bash
bash tools/adminer/serve.sh      # levanta Adminer en el puerto 8080
```
Expón el puerto **8080** (en Codespaces: Public) y abre la URL. En el formulario:

| Campo         | Valor                                                   |
|---------------|---------------------------------------------------------|
| System        | **SQLite 3**                                            |
| Servidor      | (vacío)                                                 |
| Usuario/Clave | (vacío)                                                 |
| Base de datos | ruta absoluta a `backend/database/database.sqlite`      |

`serve.sh` imprime la ruta absoluta del `.sqlite` al arrancar.

> ⚠️ Adminer da acceso total a la BD. No dejes su puerto en "Public" más tiempo
> del necesario ni lo despliegues en un entorno real sin protección.

---

## Verificar el login rápido (sin frontend)

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```
Debe responder un JSON con `token` y `usuario`.

## Problemas comunes

- **"Error de conexión con el servidor"** → el frontend no alcanza el backend:
  revisa `VITE_API_URL` y que el backend esté corriendo/accesible.
- **Error de CORS en la consola del navegador** → agrega el origen exacto del
  frontend a `CORS_ALLOWED_ORIGINS` (esquema + host + puerto, sin barra final).
- **"Credenciales incorrectas" siempre** → falta `php artisan migrate --seed`.
- **500 al iniciar** → falta `php artisan key:generate` (APP_KEY vacío).
