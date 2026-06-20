<?php

namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    /** GET /api/productos — Lista todos o filtra por nombre/marca */
    public function index(Request $request)
    {
        $productos = Producto::with('proveedor')
            ->where('estado', true)
            ->when($request->filled('search'), function ($query) use ($request) {
                $q = $request->search;
                $query->where(function ($subQuery) use ($q) {
                    $subQuery->where('nombre', 'like', "%{$q}%")
                        ->orWhere('marca', 'like', "%{$q}%")
                        ->orWhere('codigo_producto', 'like', "%{$q}%");
                });
            })
            ->paginate(10);

        return response()->json($productos);
    }

    /** POST /api/productos — Registra un producto nuevo */
    public function store(StoreProductoRequest $request)
    {
        $validated = $request->validated();

        $producto = Producto::create([
            'codigo_producto' => strtoupper($validated['num_serie']),
            'nombre'          => $validated['nombre'],
            'marca'           => $validated['marca'],
            'modelo'          => $validated['nombre'],
            'procesador'      => 'N/D',
            'ram'             => 'N/D',
            'almacenamiento'  => 'N/D',
            'gpu'             => 'N/D',
            'precio'          => $validated['precio'],
            'stock_actual'    => $validated['stock_actual'],
            'stock_minimo'    => $validated['stock_minimo'],
            'estado'          => true,
            'ubicacion'       => $request->input('ubicacion', 'Almacén'),
            'fecha_registro'  => now(),
            'id_proveedor'    => $validated['id_proveedor'],
        ]);

        return response()->json($producto->load('proveedor'), 201);
    }

    /** PUT /api/productos/{id} — Actualiza un producto */
    public function update(UpdateProductoRequest $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $validated = $request->validated();

        $datos = [];
        if (isset($validated['num_serie'])) {
            $datos['codigo_producto'] = strtoupper($validated['num_serie']);
        }
        if (isset($validated['nombre'])) {
            $datos['nombre'] = $validated['nombre'];
            $datos['modelo'] = $validated['nombre'];
        }
        if (isset($validated['marca'])) {
            $datos['marca'] = $validated['marca'];
        }
        if (isset($validated['precio'])) {
            $datos['precio'] = $validated['precio'];
        }
        if (isset($validated['stock_actual'])) {
            $datos['stock_actual'] = $validated['stock_actual'];
        }
        if (isset($validated['stock_minimo'])) {
            $datos['stock_minimo'] = $validated['stock_minimo'];
        }
        if (isset($validated['id_proveedor'])) {
            $datos['id_proveedor'] = $validated['id_proveedor'];
        }

        $producto->update($datos);

        return response()->json($producto->load('proveedor'));
    }

    /** PUT /api/productos/{id}/stock — Ajuste manual de inventario con auditoría */
    public function actualizarStock(Request $request, $id)
    {
        $request->validate([
            'nuevo_stock' => 'required|integer|min:0',
            'ajuste'      => 'required|integer',
            'motivo'      => 'required|string|max:100',
        ]);

        try {
            DB::transaction(function () use ($request, $id) {
                $producto = Producto::lockForUpdate()->findOrFail($id);
                $producto->update(['stock_actual' => $request->nuevo_stock]);

                $tipoMovimiento = $request->ajuste > 0 ? 'Entrada Ajuste' : 'Salida Merma';
                $usuario = $request->user();

                MovimientoInventario::create([
                    'id_producto'      => $producto->id_producto,
                    'id_usuario'       => $usuario?->id_usuario ?? 'U001',
                    'tipo_movimiento'  => $tipoMovimiento,
                    'cantidad'         => abs($request->ajuste),
                    'motivo'           => 'Ajuste manual: ' . $request->motivo,
                    'fecha_movimiento' => now(),
                ]);
            });

            return response()->json(['message' => 'Stock y auditoría actualizados correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error de estabilidad: ' . $e->getMessage()], 500);
        }
    }
}
