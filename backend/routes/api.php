<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Security\AuthController;
use App\Modules\Core\ProductoController;
use App\Modules\Core\VentaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Importa el controlador en la parte superior de tu api.php
use App\Modules\Reports\ReporteController;
// Agrégalos en la parte superior junto a los demás 'use'
use App\Modules\Core\ProveedorController;
use App\Modules\Security\UsuarioController;

// Agrega esto debajo de tus otras rutas
Route::apiResource('proveedores', ProveedorController::class);
Route::apiResource('usuarios', UsuarioController::class);
// Añade la ruta del reporte
Route::get('/reportes/ventas/exportar', [ReporteController::class, 'exportarVentasCSV']);

Route::get('/dashboard/metricas', [\App\Modules\Core\DashboardController::class, 'metricas']);

Route::put('/productos/{id}/stock', [\App\Modules\Core\ProductoController::class, 'actualizarStock']);
// ── Rutas Públicas (Sin Autenticación) ──────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ── Rutas Protegidas por Sanctum Bearer Token ───────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ── Módulo: Dashboard (Ambos roles) ─────────────────────────────────
    Route::get('/dashboard', function () {
        return response()->json([
            'laptops_inventario' => 120,
            'bajo_stock'         => 3,
            'ingresos_hoy'       => 4500.50,
            'vendidas_hoy'       => 5,
            'tasa_quiebre'       => 2.5
        ]);
    })->middleware('role:admin,vendedor');

    // ── Módulo: Productos ───────────────────────────────────────────────
    // Buscar / Listar (Ambos roles)
    Route::get('/productos', [ProductoController::class, 'index'])->middleware('role:admin,vendedor');
    // Registrar Nuevo (Solo Admin)
    Route::post('/productos', [ProductoController::class, 'store'])->middleware('role:admin');
    // Actualizar (Solo Admin)
    Route::put('/productos/{id}', [ProductoController::class, 'update'])->middleware('role:admin');

    // ── Módulo: Stock (Actualizar Stock - Ambos roles) ─────────────────
    Route::post('/stock/actualizar', function () {
        return response()->json(['message' => 'Stock actualizado (Mock)']);
    })->middleware('role:admin,vendedor');

    // ── Módulo: Ventas (Solo Vendedor) ──────────────────────────────────
    Route::post('/ventas', [VentaController::class, 'store'])->middleware('role:vendedor');

    // ── Módulo: Proveedores ─────────────────────────────────────────────
    // Listar (Ambos)
    Route::get('/proveedores', function () {
        return response()->json([
            ['id_proveedor' => 'PR01', 'razon_social' => 'Distribuidora Laptops SAC', 'ruc' => '20123456789', 'estado' => true],
            ['id_proveedor' => 'PR02', 'razon_social' => 'Importadora Tecno Perú', 'ruc' => '20987654321', 'estado' => true]
        ]);
    })->middleware('role:admin,vendedor');
    // Registrar (Solo Admin)
    Route::post('/proveedores', function () {
        return response()->json(['message' => 'Proveedor registrado (Mock)'], 201);
    })->middleware('role:admin');
    // Actualizar (Solo Admin)
    Route::put('/proveedores/{id}', function () {
        return response()->json(['message' => 'Proveedor actualizado (Mock)']);
    })->middleware('role:admin');
    // Eliminar (Solo Admin)
    Route::delete('/proveedores/{id}', function () {
        return response()->json(['message' => 'Proveedor eliminado (Mock)']);
    })->middleware('role:admin');

    // ── Módulo: Movimientos (Ambos) ─────────────────────────────────────
    Route::get('/movimientos', function () {
        return response()->json([
            ['id_movimiento' => 'M001', 'tipo_movimiento' => 'Entrada', 'fecha_movimiento' => now()->toDateTimeString(), 'cantidad' => 10, 'id_producto' => 'P001']
        ]);
    })->middleware('role:admin,vendedor');

    // ── Módulo: Reporte PDF (Ambos) ─────────────────────────────────────
    Route::get('/reporte/pdf', function () {
        return response()->json(['message' => 'Reporte PDF generado (Mock)']);
    })->middleware('role:admin,vendedor');

    // ── Módulo: Algoritmo Predictivo (Ambos) ────────────────────────────
    Route::get('/productos/{id}/proveedor-sugerido', function ($id) {
        return response()->json([
            'id_proveedor' => 'PR01',
            'razon_social' => 'Distribuidora Laptops SAC',
            'score'        => 95.5,
            'motivo'       => 'Precio unitario más bajo y excelente frecuencia de entrega'
        ]);
    })->middleware('role:admin,vendedor');
});
