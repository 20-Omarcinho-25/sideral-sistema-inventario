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
        $query = Producto::with('proveedor');
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where('nombre','like',"%$q%")->orWhere('marca','like',"%$q%");
        }
        return response()->json($query->get());
    }

    /** POST /api/productos — Registra nuevo producto */
    public function store(StoreProductoRequest $request) {
        $producto = Producto::create(array_merge(
            $request->validated(),
            ['id_producto' => uniqid('P'), 'fecha_registro' => now()]
        ));
        return response()->json($producto, 201);
    }

    /** PUT /api/productos/{id} — Actualiza datos del producto */
    public function update(UpdateProductoRequest $request, string $id) {
        $producto = Producto::findOrFail($id);
        $producto->update($request->validated());
        return response()->json($producto);
    }
}

// ─────────────────────────────────────────────────────────
