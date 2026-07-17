<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SecuritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Roles
        Rol::updateOrCreate(
            ['id_rol' => 'R001'],
            ['nombre_rol' => 'admin', 'descripcion' => 'Administrador de Sistema']
        );

        Rol::updateOrCreate(
            ['id_rol' => 'R002'],
            ['nombre_rol' => 'vendedor', 'descripcion' => 'Vendedor de Laptops']
        );

        // 2. Usuarios
        // El usuario admin
        Usuario::updateOrCreate(
            ['id_usuario' => 'U001'],
            [
                'nombre' => 'Admin',
                'apellido' => 'Sideral',
                'username' => 'admin',
                'password_hash' => Hash::make('Admin123!'), // Valid strong password
                'correo' => 'admin@sideral.com',
                'estado' => true,
                'fecha_registro' => now(),
                'id_rol' => 'R001',
            ]
        );

        // El usuario vendedor
        Usuario::updateOrCreate(
            ['id_usuario' => 'U002'],
            [
                'nombre' => 'Vendedor',
                'apellido' => 'Sideral',
                'username' => 'vendedor',
                'password_hash' => Hash::make('Vendedor123!'), // Valid strong password
                'correo' => 'vendedor@sideral.com',
                'estado' => true,
                'fecha_registro' => now(),
                'id_rol' => 'R002',
            ]
        );

        // Usuario inactivo (para probar restricción)
        Usuario::updateOrCreate(
            ['id_usuario' => 'U003'],
            [
                'nombre' => 'Inactivo',
                'apellido' => 'Sideral',
                'username' => 'inactivo',
                'password_hash' => Hash::make('Inactivo123!'), // Valid strong password
                'correo' => 'inactivo@sideral.com',
                'estado' => false,
                'fecha_registro' => now(),
                'id_rol' => 'R002',
            ]
        );
    }
}
