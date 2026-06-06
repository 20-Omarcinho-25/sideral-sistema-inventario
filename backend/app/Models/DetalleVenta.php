<?php
// app/Models/DetalleVenta.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleVenta extends Model {
    protected $table = 'detalle_venta';
    // ...
    /** Calcula el subtotal de un item */
    public function calcularSubtotal(int $cant, float $precio): float {
        return round($cant * $precio, 2);
    }
}
