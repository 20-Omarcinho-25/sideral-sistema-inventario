<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConteoInventario extends Model
{
    protected $table = 'conteo_inventario';
    protected $primaryKey = 'id_conteo';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'unidades_contadas',
        'fecha',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'unidades_contadas' => 'integer',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }
}
