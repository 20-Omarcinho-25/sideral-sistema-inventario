<?php
// app/Modules/Core/VentaController.php
namespace App\Modules\Core;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;
use App\Models\Producto;
use App\Http\Requests\StoreVentaRequest;

class VentaController extends Controller {

    /**
     * POST /api/ventas
     * Crea la venta con sus detalles en una transaccion atomica.
     * Al finalizar, dispara VentaFinalizada -> Observer descuenta stock.
     */
    public function store(StoreVentaRequest $request) {
        return DB::transaction(function () use ($request) {
            $venta = Venta::create([
                'id_venta'       => uniqid('V'),
                'fecha_venta'    => now(),
                'estado'         => 'Pendiente',
                'nombre_cliente' => $request->nombre_cliente,
                'dni_cliente'    => $request->dni_cliente,
                'id_usuario'     => auth()->id(),
                'total'          => 0,
            ]);

            foreach ($request->productos as $item) {
                $producto = Producto::findOrFail($item['id_producto']);
                $venta->agregarDetalle($producto, $item['cantidad']);
            }

            $venta->total = $venta->calcularTotalVenta($venta->detalles->toArray());
            $venta->finalizarVenta(auth()->user());

            return response()->json($venta->load('detalles'), 201);
        });
    }
}


