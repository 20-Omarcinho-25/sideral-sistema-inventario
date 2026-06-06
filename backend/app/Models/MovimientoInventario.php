<?php
// app/Models/MovimientoInventario.php
class MovimientoInventario extends Model {
    protected $table = 'movimiento_inventario';
    // ...
    /**
     * Registra un movimiento de inventario.
     * @param Producto $p    Producto afectado
     * @param Usuario  $u    Usuario responsable
     * @param int      $cant Cantidad
     * @param string   $tipo 'Entrada'|'Salida'|'Ajuste'
     */
    public function registrarMovimiento(Producto $p, Usuario $u,
                                         int $cant, string $tipo): bool {
        return (bool) self::create([
            'id_movimiento'    => uniqid('MV'),
            'tipo_movimiento'  => $tipo,
            'fecha_movimiento' => now(),
            'cantidad'         => $cant,
            'id_producto'      => $p->id_producto,
            'id_usuario'       => $u->id_usuario,
        ]);
    }
}
