<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedor';
    protected $primaryKey = 'id_proveedor';
    public $incrementing = false; // Falso si usan IDs como 'PRV-01'
    protected $keyType = 'string';
    public $timestamps = false; // Depende de si pusiste timestamps en tu migración

    protected $fillable = [
        'id_proveedor',
        'razon_social',
        'ruc',
        'telefono',
        'correo',
        'direccion',
        'estado'
    ];
}