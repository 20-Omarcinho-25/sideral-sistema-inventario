<?php

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    public function run(): void
    {
        Proveedor::updateOrCreate(
            ['id_proveedor' => 'PR01'],
            [
                'razon_social' => 'Distribuidora Laptops SAC',
                'ruc'          => '20123456789',
                'telefono'     => '999888777',
                'correo'       => 'ventas@laptops-sac.com',
                'direccion'    => 'Av. Industrial 120, Lima',
                'estado'       => true,
            ]
        );

        Proveedor::updateOrCreate(
            ['id_proveedor' => 'PR02'],
            [
                'razon_social' => 'Importadora Tecno Perú',
                'ruc'          => '20987654321',
                'telefono'     => '988776655',
                'correo'       => 'contacto@tecnoperu.com',
                'direccion'    => 'Jr. Comercio 45, Arequipa',
                'estado'       => true,
            ]
        );

        Proveedor::updateOrCreate(
            ['id_proveedor' => 'PR03'],
            [
                'razon_social' => 'TechSupply Global',
                'ruc'          => '20456789123',
                'telefono'     => '977665544',
                'correo'       => 'info@techsupply.com',
                'direccion'    => 'Calle Los Olivos 88, Trujillo',
                'estado'       => true,
            ]
        );
    }
}
