<?php
// app/Models/Venta.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model {
    protected $table      = 'venta';
    protected $primaryKey = 'id_venta';
    public    $incrementing = true;
    public    $timestamps  = false;
    protected $fillable = ['id_venta','fecha_venta','total','estado',
                           'nombre_cliente','dni_cliente','id_usuario'];

    public function detalles() { return $this->hasMany(DetalleVenta::class,'id_venta','id_venta'); }
    public function usuario()  { return $this->belongsTo(Usuario::class,'id_usuario','id_usuario'); }

    /**
     * Agrega un detalle a la venta y reserva stock temporalmente.
     * @throws \Exception si stock insuficiente
     */
    public function agregarDetalle(Producto $prod, int $cant): void {
        if ($prod->stock_actual < $cant) {
            throw new \Exception("Stock insuficiente para {$prod->nombre}");
        }
        DetalleVenta::create([
            'id_venta'        => $this->id_venta,
            'id_producto'     => $prod->id_producto,
            'cantidad'        => $cant,
            'precio_unitario' => $prod->precio,
            'subtotal'        => $cant * $prod->precio,
        ]);
    }

    /** Suma subtotales de todos los detalles y retorna el total */
    public function calcularTotalVenta(array $detalles): float {
        return collect($detalles)->sum('subtotal');
    }

    /** Marca la venta como completada */
    public function finalizarVenta(Usuario $vendedor): bool {
        $this->estado     = 'Completada';
        $this->id_usuario = $vendedor->id_usuario;
        $this->save();
        return true;
    }
}
