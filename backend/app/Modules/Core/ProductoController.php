<?php
// app/Modules/Core/ProductoController.php
namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use Illuminate\Http\Request;

class ProductoController extends Controller {
/** GET /api/productos — Lista todos o filtra por nombre/marca */
   public function index(Request $request) {
        $productos = Producto::with('proveedor')
            ->where('estado', true) // <--- ESTA LÍNEA ES CLAVE (Filtra solo los activos)
            ->when($request->filled('search'), function ($query) use ($request) {
                $q = $request->search;
                $query->where(function($subQuery) use ($q) {
                    $subQuery->where('nombre', 'like', "%{$q}%")
                             ->orWhere('marca', 'like', "%{$q}%");
                });
            })
            ->paginate(10); 

        return response()->json($productos);
    }
    
    // ... el resto de tus funciones store y update quedan igual ...


    /** PUT /api/productos/{id}/stock — Ajuste manual de inventario con auditoría */
    public function actualizarStock(Request $request, $id) {
        // 1. Validamos estrictamente los datos de entrada
        $request->validate([
            'nuevo_stock' => 'required|integer|min:0',
            'ajuste'      => 'required|integer', // Puede ser positivo o negativo
            'motivo'      => 'required|string|max:100'
        ]);

        try {
            // 2. Transacción Atómica: O se guarda todo, o no se guarda nada
            DB::transaction(function () use ($request, $id) {
                
                // Bloqueamos la fila temporalmente para evitar que alguien venda esta laptop 
                // justo en el milisegundo que el administrador ajusta el stock
                $producto = Producto::lockForUpdate()->findOrFail($id);

                // Actualizamos el stock en la tabla producto
                $producto->update(['stock_actual' => $request->nuevo_stock]);

                // Determinamos si fue una entrada (positiva) o salida (negativa/merma)
                $tipoMovimiento = $request->ajuste > 0 ? 'Entrada Ajuste' : 'Salida Merma';

                // 3. Dejamos huella en la tabla de Auditoría (Movimiento_Inventario)
                MovimientoInventario::create([
                    'id_producto'     => $producto->id_producto,
                    'id_usuario'      => request()->user()->id_usuario ?? 1, // ID de quien hizo el cambio
                    'tipo_movimiento' => $tipoMovimiento,
                    'cantidad'        => abs($request->ajuste), // Guardamos el valor en positivo
                    'motivo'          => 'Ajuste manual: ' . $request->motivo,
                    'fecha_movimiento'=> now()
                ]);
            });

            return response()->json(['message' => 'Stock y auditoría actualizados correctamente.']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error de estabilidad: ' . $e->getMessage()], 500);
        }
    }
}

// ─────────────────────────────────────────────────────────
