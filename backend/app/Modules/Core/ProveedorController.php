<?php

namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    /** GET /api/proveedores - Lista SOLO proveedores activos (en caliente) */
    public function index()
    {
        // Rendimiento O(1) y filtrado de Eliminados Lógicos
        $proveedores = Proveedor::where('estado', true)->orderBy('razon_social', 'asc')->get();
        return response()->json($proveedores);
    }

    /** POST /api/proveedores - Crea un proveedor previniendo errores de BD */
    public function store(Request $request)
    {
        $request->validate([
            'razon_social' => 'required|string|max:100',
            // unique: evita que la BD colapse (Error 500) si insertan un RUC duplicado
            'ruc'          => 'required|digits:11|unique:proveedor,ruc',
            'correo'       => 'nullable|email|max:100',
        ]);

        $proveedor = Proveedor::create(array_merge(
            $request->only(['razon_social', 'ruc', 'telefono', 'correo', 'direccion']),
            [
                'id_proveedor' => $this->generarIdProveedor(),
                'estado'       => true,
            ]
        ));

        return response()->json($proveedor, 201);
    }

    /** PUT /api/proveedores/{id} - Actualiza proveedor */
    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::findOrFail($id);
        
        $request->validate([
            'razon_social' => 'sometimes|required|string|max:100',
            // Ignoramos el RUC del proveedor actual para que no marque error al actualizar
            'ruc'          => 'sometimes|required|digits:11|unique:proveedor,ruc,' . $id . ',id_proveedor',
        ]);

        $proveedor->update($request->all());
        return response()->json($proveedor);
    }

    /** DELETE /api/proveedores/{id} - ELIMINACIÓN LÓGICA (Simplista y Operacional) */
    public function destroy($id)
    {
        $proveedor = Proveedor::findOrFail($id);
        // En lugar de borrar la fila (que rompería las laptops), lo apagamos.
        $proveedor->update(['estado' => false]);
        return response()->json(['message' => 'Proveedor desactivado exitosamente.']);
    }

    private function generarIdProveedor(): string
    {
        $ultimo = Proveedor::orderBy('id_proveedor', 'desc')->first();

        if (!$ultimo) {
            return 'PR01';
        }

        $numero = (int) substr($ultimo->id_proveedor, 2);

        return 'PR' . str_pad((string) ($numero + 1), 2, '0', STR_PAD_LEFT);
    }
}