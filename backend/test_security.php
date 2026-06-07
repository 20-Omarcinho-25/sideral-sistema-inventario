<?php

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Route;

// Inicialización de Laravel (Bootstrap)
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Función auxiliar para simular solicitudes HTTP
function runRequest($kernel, $method, $uri, $body = [], $headers = []) {
    $server = [];
    foreach ($headers as $k => $v) {
        $server['HTTP_'.str_replace('-', '_', strtoupper($k))] = $v;
    }
    // Configurar Content-Type y Accept para recibir JSON
    $server['CONTENT_TYPE'] = 'application/json';
    $server['HTTP_ACCEPT'] = 'application/json';
    
    // Limpiar el usuario autenticado en caché para evitar que se comparta entre peticiones del test
    if (app()->resolved('auth')) {
        auth()->forgetGuards();
    }
    
    $request = Request::create($uri, $method, [], [], [], $server, json_encode($body));
    $response = $kernel->handle($request);
    $kernel->terminate($request, $response);
    return $response;
}

echo "Ejecutando pruebas de verificación de seguridad...\n";

// 1. Probar login con credenciales inválidas
$res = runRequest($kernel, 'POST', '/api/login', ['username' => 'admin', 'password' => 'wrong']);
if ($res->getStatusCode() !== 422) {
    echo "ERROR: El login con credenciales incorrectas debería devolver 422, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: El login con credenciales incorrectas devuelve 422.\n";

// 2. Probar login con usuario inactivo
$res = runRequest($kernel, 'POST', '/api/login', ['username' => 'inactivo', 'password' => 'Inactivo123!']);
if ($res->getStatusCode() !== 403) {
    echo "ERROR: El login con usuario inactivo debería devolver 403, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: El login con usuario inactivo devuelve 403.\n";

// 3. Probar login exitoso de administrador
$res = runRequest($kernel, 'POST', '/api/login', ['username' => 'admin', 'password' => 'Admin123!']);
if ($res->getStatusCode() !== 200) {
    echo "ERROR: El login de administrador debería devolver 200, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
$data = json_decode($res->getContent(), true);
$adminToken = $data['token'];
if (empty($adminToken)) {
    echo "ERROR: El token del administrador está vacío.\n";
    exit(1);
}
echo "CORRECTO: El login de administrador devolvió 200 y el token.\n";

// 4. Probar login exitoso de vendedor
$res = runRequest($kernel, 'POST', '/api/login', ['username' => 'vendedor', 'password' => 'Vendedor123!']);
if ($res->getStatusCode() !== 200) {
    echo "ERROR: El login de vendedor debería devolver 200, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
$data = json_decode($res->getContent(), true);
$vendedorToken = $data['token'];
if (empty($vendedorToken)) {
    echo "ERROR: El token del vendedor está vacío.\n";
    exit(1);
}
echo "CORRECTO: El login de vendedor devolvió 200 y el token.\n";

// 5. Probar acceso al Dashboard (requiere rol admin o vendedor)
$res = runRequest($kernel, 'GET', '/api/dashboard', [], ['Authorization' => 'Bearer ' . $adminToken]);
if ($res->getStatusCode() !== 200) {
    echo "ERROR: Administrador accediendo al dashboard debería devolver 200, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Administrador accediendo al dashboard devuelve 200.\n";

$res = runRequest($kernel, 'GET', '/api/dashboard', [], ['Authorization' => 'Bearer ' . $vendedorToken]);
if ($res->getStatusCode() !== 200) {
    echo "ERROR: Vendedor accediendo al dashboard debería devolver 200, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Vendedor accediendo al dashboard devuelve 200.\n";

// 6. Probar registro de productos (requiere admin - el vendedor debería recibir 403)
$res = runRequest($kernel, 'POST', '/api/productos', [], ['Authorization' => 'Bearer ' . $vendedorToken]);
if ($res->getStatusCode() !== 403) {
    echo "ERROR: Vendedor accediendo a ruta de administrador /api/productos debería recibir 403, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Vendedor bloqueado en ruta de administrador /api/productos (403).\n";

$res = runRequest($kernel, 'POST', '/api/productos', [
    'num_serie' => 'S12345',
    'nombre' => 'Laptop Gamer',
    'marca' => 'ASUS',
    'precio' => 1500.00,
    'stock_actual' => 10,
    'stock_minimo' => 2,
    'id_proveedor' => 'PR01'
], ['Authorization' => 'Bearer ' . $adminToken]);
// Debería devolver 422 porque PR01 no existe en la tabla de proveedores todavía (error de validación)
// pero esto demuestra que pasó exitosamente el filtro de autenticación y roles.
if ($res->getStatusCode() !== 422) {
    echo "ERROR: Administrador accediendo a /api/productos debería pasar la autorización y fallar la validación con 422, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Administrador autorizado en /api/productos (la validación funciona y devuelve 422).\n";

// 7. Probar cierre de sesión (Logout)
$res = runRequest($kernel, 'POST', '/api/logout', [], ['Authorization' => 'Bearer ' . $adminToken]);
if ($res->getStatusCode() !== 200) {
    echo "ERROR: El logout debería devolver 200, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Cierre de sesión exitoso.\n";

// 8. Probar acceso después de cerrar sesión
$res = runRequest($kernel, 'GET', '/api/dashboard', [], ['Authorization' => 'Bearer ' . $adminToken]);
if ($res->getStatusCode() !== 401) {
    echo "ERROR: Acceder después del logout debería devolver 401, devolvió " . $res->getStatusCode() . "\n";
    exit(1);
}
echo "CORRECTO: Acceso denegado con token revocado devuelve 401.\n";

echo "\n¡FELICITACIONES: Todas las pruebas de verificación de seguridad del backend pasaron con éxito!\n";
