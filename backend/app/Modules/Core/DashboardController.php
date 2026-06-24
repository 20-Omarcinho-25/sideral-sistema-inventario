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

            // 2. MySQL cuenta cuántas laptops están en peligor (stock_actual <= stock_minimo)
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

    /** GET /api/dashboard/estadisticas-ventas — Reporte con máximos, mínimos y promedios */
    public function estadisticasVentas()
    {
        try {
            // 1. Venta más alta del mes
            $ventaMaxima = Venta::whereMonth('fecha_venta', now()->month)
                                ->whereYear('fecha_venta', now()->year)
                                ->where('estado', 'Completada')
                                ->max('total') ?? 0;

            // 2. Venta más baja del mes
            $ventaMinima = Venta::whereMonth('fecha_venta', now()->month)
                                ->whereYear('fecha_venta', now()->year)
                                ->where('estado', 'Completada')
                                ->min('total') ?? 0;

            // 3. Promedio de ventas del mes
            $promedioVentas = Venta::whereMonth('fecha_venta', now()->month)
                                    ->whereYear('fecha_venta', now()->year)
                                    ->where('estado', 'Completada')
                                    ->avg('total') ?? 0;

            // 4. Total de ventas del mes (cantidad de transacciones)
            $cantidadVentas = Venta::whereMonth('fecha_venta', now()->month)
                                    ->whereYear('fecha_venta', now()->year)
                                    ->where('estado', 'Completada')
                                    ->count() ?? 0;

            // 5. Producto más vendido (por cantidad total)
            $productoMasVendido = DB::table('detalle_venta')
                ->join('producto', 'detalle_venta.id_producto', '=', 'producto.id_producto')
                ->select('producto.nombre', DB::raw('SUM(detalle_venta.cantidad) as total_vendido'))
                ->whereMonth('detalle_venta.fecha_venta', now()->month)
                ->whereYear('detalle_venta.fecha_venta', now()->year)
                ->groupBy('producto.nombre')
                ->orderByDesc('total_vendido')
                ->first();

            return response()->json([
                'venta_maxima'       => (float) $ventaMaxima,
                'venta_minima'       => (float) $ventaMinima,
                'promedio_ventas'    => (float) $promedioVentas,
                'cantidad_ventas'    => (int) $cantidadVentas,
                'producto_mas_vendido' => $productoMasVendido ? [
                    'nombre' => $productoMasVendido->nombre,
                    'cantidad' => (int) $productoMasVendido->total_vendido
                ] : null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'venta_maxima'       => 0,
                'venta_minima'       => 0,
                'promedio_ventas'    => 0,
                'cantidad_ventas'    => 0,
                'producto_mas_vendido' => null,
                'error'              => 'Error al calcular estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}