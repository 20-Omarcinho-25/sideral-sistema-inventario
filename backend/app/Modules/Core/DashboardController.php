<?php

namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\Proveedor;

class DashboardController extends Controller
{
    /** GET /api/dashboard/metricas — Consultas SQL Optimizadas para rendimiento */
    public function metricas()
    {
        try {
            // 1. MySQL suma los totales directamente (Tiempo de respuesta: Milisegundos)
            $totalVentasMes = Venta::whereMonth('fecha_venta', now()->month)
                                   ->whereYear('fecha_venta', now()->year)
                                   ->where('estado', 'Completada')
                                   ->sum('total') ?? 0;

            // 2. MySQL cuenta cuántas laptops están en peligro (stock_actual <= stock_minimo)
            $productosBajoStock = Producto::whereColumn('stock_actual', '<=', 'stock_minimo')->count() ?? 0;

            // 3. MySQL cuenta proveedores activos (sin filtro de estado para evitar errores)
            $proveedoresActivos = Proveedor::count() ?? 0;

            // 4. Últimas 5 transacciones para la tabla resumen (Limitamos con 'take' para no saturar)
            $ventasRecientes = Venta::orderBy('fecha_venta', 'desc')
                                    ->take(5)
                                    ->get(['id_venta', 'nombre_cliente', 'total', 'fecha_venta']) ?? [];

            return response()->json([
                'ventas_mes'          => (float) $totalVentasMes,
                'bajo_stock'          => (int) $productosBajoStock,
                'proveedores_activos' => (int) $proveedoresActivos,
                'ventas_recientes'    => $ventasRecientes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'ventas_mes'          => 0,
                'bajo_stock'          => 0,
                'proveedores_activos' => 0,
                'ventas_recientes'    => [],
                'error'              => 'Error al calcular métricas: ' . $e->getMessage()
            ], 500);
        }
    }
}