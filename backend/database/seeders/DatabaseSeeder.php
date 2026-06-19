<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Poblador inicial de la base de datos (Ejecución en caliente)
     */
    public function run(): void
    {
        // 1. Creamos el Rol de Administrador (para que no falle la llave foránea)
        DB::table('rol')->insert([
            'id_rol' => 1,
            'nombre' => 'Administrador', // Cámbialo a 'nombre_rol' si tu migración usa ese nombre
        ]);

        // 2. Creamos al Superusuario Oficial con contraseña encriptada
        DB::table('usuario')->insert([
            'nombre'        => 'Admin',
            'apellido'      => 'Sideral',
            'username'      => 'admin',
            'correo'        => 'admin@sideral.com',
            'password_hash' => Hash::make('123456'), // Contraseña obligatoria: 123456
            'id_rol'        => 1,
            'estado'        => true
        ]);
    }
}