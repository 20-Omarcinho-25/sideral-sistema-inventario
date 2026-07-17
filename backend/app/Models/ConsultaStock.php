<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsultaStock extends Model
{
    protected $table = 'consulta_stock';
    protected $primaryKey = 'id_consulta';
    public $timestamps = false;

    protected $fillable = [
        'minutos',
        'fecha',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'minutos' => 'integer',
    ];
}
