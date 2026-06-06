<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'id_usuario';
    public $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre',
        'apellido',
        'username',
        'password_hash',
        'correo',
        'estado',
        'fecha_registro',
        'id_rol',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * Retorna la contraseña para autenticación.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Relación: un usuario pertenece a un rol.
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }

    /**
     * Verifica si el usuario tiene rol de Administrador.
     */
    public function esAdmin(): bool
    {
        return $this->rol && (strtolower($this->rol->nombre_rol) === 'admin' || $this->rol->id_rol === 'R001');
    }

    /**
     * Verifica si el usuario tiene rol de Vendedor.
     */
    public function esVendedor(): bool
    {
        return $this->rol && (strtolower($this->rol->nombre_rol) === 'vendedor' || $this->rol->id_rol === 'R002');
    }
}
