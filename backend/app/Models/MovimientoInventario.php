<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    protected $table = 'movimiento_inventario';
    protected $primaryKey = 'id_movimiento';
    public $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_movimiento',
        'tipo_movimiento',
        'fecha_movimiento',
        'cantidad',
        'id_producto',
        'id_usuario',
    ];
}
