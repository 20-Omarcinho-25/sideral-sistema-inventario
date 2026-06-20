<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Producto extends Model
{
    protected $table = 'producto';
    protected $primaryKey = 'id_producto';
    public $timestamps = false;

    protected $fillable = [
        'codigo_producto',
        'nombre',
        'marca',
        'modelo',
        'procesador',
        'ram',
        'almacenamiento',
        'gpu',
        'precio',
        'stock_actual',
        'stock_minimo',
        'estado',
        'ubicacion',
        'fecha_registro',
        'id_proveedor',
    ];

    protected $casts = [
        'precio' => 'float',
        'stock_actual' => 'integer',
        'stock_minimo' => 'integer',
        'estado' => 'boolean',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function verificarAlertaStock(int $actual, int $minimo): bool
    {
        if ($actual < $minimo) {
            Log::warning("[Sideral] Stock bajo: {$this->nombre} | actual={$actual} minimo={$minimo}");
            return true;
        }
        return false;
    }
}
