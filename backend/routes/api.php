<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Security\AuthController;
use App\Modules\Core\ProductoController;
use App\Modules\Core\VentaController;
use App\Modules\Reports\ReporteController;
use App\Modules\Core\ProveedorController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/metricas', [\App\Modules\Core\DashboardController::class, 'metricas'])
        ->middleware('role:admin,vendedor');

    Route::get('/productos/siguiente-codigo', [ProductoController::class, 'siguienteCodigo'])
        ->middleware('role:admin');
    Route::get('/productos', [ProductoController::class, 'index'])
        ->middleware('role:admin,vendedor');
    Route::post('/productos', [ProductoController::class, 'store'])
        ->middleware('role:admin');
    Route::put('/productos/{id}', [ProductoController::class, 'update'])
        ->middleware('role:admin');
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy'])
        ->middleware('role:admin');
    Route::put('/productos/{id}/stock', [ProductoController::class, 'actualizarStock'])
        ->middleware('role:admin,vendedor');

    Route::post('/ventas', [VentaController::class, 'store'])
        ->middleware('role:admin,vendedor');

    Route::get('/proveedores', [ProveedorController::class, 'index'])
        ->middleware('role:admin,vendedor');
    Route::post('/proveedores', [ProveedorController::class, 'store'])
        ->middleware('role:admin');
    Route::put('/proveedores/{id}', [ProveedorController::class, 'update'])
        ->middleware('role:admin');
    Route::delete('/proveedores/{id}', [ProveedorController::class, 'destroy'])
        ->middleware('role:admin');

    Route::get('/reportes/ventas/exportar', [ReporteController::class, 'exportarVentasPDF'])
        ->middleware('role:admin,vendedor');
});
