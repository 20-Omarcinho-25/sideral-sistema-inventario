<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetaTrimestral extends Model
{
    protected $table = 'meta_trimestral';

    protected $primaryKey = 'id_meta';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'trimestre',
        'anio',
        'meta_planificada',
        'estado',
    ];

    protected $casts = [
        'trimestre' => 'integer',
        'anio' => 'integer',
        'meta_planificada' => 'decimal:2',
        'estado' => 'boolean',
    ];
}