<?php
// app/Modules/Core/ProductoController.php
namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use Illuminate\Http\Request;

class ProductoController extends Controller {

   public function index(Request $request) {
        
        $productos = Producto::with('proveedor')
            // El método 'when' evalúa si existe 'search'. 
            // Si es true, ejecuta la función anónima (cierre/closure) aplicando los wheres.
            // Si es false, ignora la función anónima y sigue su camino.
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('marca', 'like', "%{$request->search}%");
            })
            // Extrae los datos en bloques de 10 en 10
            ->paginate(10); 

        return response()->json($productos);
    }
    
    // ... el resto de tus funciones store y update quedan igual ...
}

// ─────────────────────────────────────────────────────────
