<?php
// app/Models/Producto.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Producto extends Model {
    protected $table      = 'producto';
    protected $primaryKey = 'id_producto';
    public    $keyType    = 'string';
    public    $incrementing = false;
    public    $timestamps  = false;
    protected $fillable = ['id_producto','num_serie','nombre','marca',
                           'precio','stock_actual','stock_minimo',
                           'estado','ubicacion','fecha_registro','id_proveedor'];

    /** Relacion: producto pertenece a proveedor */
    public function proveedor() { return $this->belongsTo(Proveedor::class, 'id_proveedor','id_proveedor'); }

    /**
     * Actualiza el stock segun el tipo de movimiento.
     * @param int    $cantidad   Unidades a mover (positivo)
     * @param string $tipoMov    'Entrada' | 'Salida' | 'Ajuste'
     */
    public function actualizarStock(int $cantidad, string $tipoMov): void {
        match ($tipoMov) {
            'Entrada' => $this->stock_actual += $cantidad,
            'Salida'  => $this->stock_actual -= $cantidad,
            'Ajuste'  => $this->stock_actual  = $cantidad,
        };
        $this->save();
    }

    /**
     * Verifica si el stock esta por debajo del minimo.
     * Si es true, escribe warning en laravel.log.
     */
    public function verificarAlertaStock(int $actual, int $minimo): bool {
        if ($actual < $minimo) {
            Log::warning("[AIReady] Stock bajo: {$this->nombre} | actual={$actual} minimo={$minimo}");
            return true;
        }
        return false;
    }

    /** Retorna descripcion tecnica del producto como string */
    public function obtenerFichaTecnica(): string {
        return "{$this->marca} {$this->nombre} | Serie: {$this->num_serie}"
             . " | Stock: {$this->stock_actual} | Precio: S/{$this->precio}";
    }
}
