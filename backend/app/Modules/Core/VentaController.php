<?php

namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <- CRÍTICO PARA LA ESTABILIDAD
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\MovimientoInventario;
use App\Http\Requests\StoreVentaRequest;

class VentaController extends Controller
{
  /** GET /api/ventas - Lista paginada con sus detalles y productos */
    public function index()
    {
        // El método with() hace que el rendimiento sea óptimo (Evita el problema N+1)
        $ventas = Venta::with(['detalles.producto'])
            ->orderBy('fecha_venta', 'desc')
            ->paginate(10);

        return response()->json($ventas);
    }
    /** POST /api/ventas - Registra venta y descuenta stock dinámicamente */
    public function store(StoreVentaRequest $request)
    {
        try {
            // Iniciamos la Transacción: Si una línea falla, todo se revierte (Rollback)
            $venta = DB::transaction(function () use ($request) {
                
                // 1. Crear la cabecera de la Venta
                $nuevaVenta = Venta::create([
                    'nombre_cliente' => $request->nombre_cliente,
                    'dni_cliente'    => $request->dni_cliente,
                    'fecha_venta'    => now(),
                    'total'          => 0,
                    'estado'         => 'Completada',
                    'id_usuario'     => $request->user()?->id_usuario ?? 'U001',
                ]);

                $totalVenta = 0;

                // 2. Procesar cada producto enviado desde el Frontend (React)
                foreach ($request->productos as $item) {
                    // lockForUpdate(): Bloquea la fila en MySQL temporalmente para evitar ventas duplicadas simultáneas
                    $producto = Producto::lockForUpdate()->findOrFail($item['id_producto']);
                    
                    // Validación en caliente: ¿Hay stock suficiente?
                    if ($producto->stock_actual < $item['cantidad']) {
                        throw new \Exception('Stock insuficiente para la laptop: ' . $producto->nombre);
                    }

                    $subtotal = $producto->precio * $item['cantidad'];
                    $totalVenta += $subtotal;

                    // 3. Crear el Detalle de la Venta
                    DetalleVenta::create([
                        'id_venta'        => $nuevaVenta->id_venta, 
                        'id_producto'     => $producto->id_producto,
                        'cantidad'        => $item['cantidad'],
                        'precio_unitario' => $producto->precio,
                        'subtotal'        => $subtotal,
                    ]);

                    // 4. Descontar el stock actual de la base de datos
                    $producto->decrement('stock_actual', $item['cantidad']);

                    // 5. Registrar movimiento de inventario
                    MovimientoInventario::create([
                        'id_producto'      => $producto->id_producto,
                        'id_usuario'       => $request->user()?->id_usuario ?? 'U001',
                        'tipo_movimiento'  => 'Salida Venta',
                        'cantidad'         => $item['cantidad'],
                        'motivo'           => 'Venta #' . $nuevaVenta->id_venta,
                        'fecha_movimiento' => now(),
                    ]);
                }

                // 5. Actualizar la Venta con el Total calculado real
                $nuevaVenta->update(['total' => $totalVenta]);

                return $nuevaVenta;
            });

            // Si llegamos aquí, la transacción fue un éxito total en MySQL
            return response()->json([
                'message' => 'Venta registrada con éxito y stock descontado', 
                'data' => $venta
            ], 201);

        } catch (\Exception $e) {
            // Si falta stock o cae la red, se captura el error y se envía al Frontend
            return response()->json([
                'message' => 'La venta ha sido cancelada por estabilidad del sistema: ' . $e->getMessage()
            ], 400);
        }
    }
}  // ... aquí irán los siguientes pedazos de código ...