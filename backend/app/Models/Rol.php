<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'rol';
    protected $primaryKey = 'id_rol';
    public $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_rol',
        'nombre_rol',
        'descripcion',
    ];

    /**
     * Relación: un rol tiene muchos usuarios.
     */
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_rol', 'id_rol');
    }

    /**
     * Valida permisos del rol.
     */
    public function validarPermisos(string $idRol): bool
    {
        return $this->id_rol === $idRol;
    }
}
