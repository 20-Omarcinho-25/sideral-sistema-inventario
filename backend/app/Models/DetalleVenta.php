<?php
// app/Models/DetalleVenta.php
class DetalleVenta extends Model {
    protected $table = 'detalle_venta';
    // ...
    /** Calcula el subtotal de un item */
    public function calcularSubtotal(int $cant, float $precio): float {
        return round($cant * $precio, 2);
    }
}
