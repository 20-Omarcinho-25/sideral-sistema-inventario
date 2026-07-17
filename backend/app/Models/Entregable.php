<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entregable extends Model
{
    protected $table = 'entregable';

    protected $primaryKey = 'id_entregable';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'fase',
        'aceptado',
        'fecha_aceptacion',
        'estado',
    ];

    protected $casts = [
        'aceptado' => 'boolean',
        'fecha_aceptacion' => 'datetime',
        'estado' => 'boolean',
    ];
}