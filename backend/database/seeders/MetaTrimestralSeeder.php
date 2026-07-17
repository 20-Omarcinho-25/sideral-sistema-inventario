<?php

namespace Database\Seeders;

use App\Models\MetaTrimestral;
use Illuminate\Database\Seeder;

class MetaTrimestralSeeder extends Seeder
{
    public function run(): void
    {
        MetaTrimestral::updateOrCreate(
            [
                'trimestre' => 1,
                'anio' => 2026,
            ],
            [
                'descripcion' => 'Meta de ventas del primer trimestre',
                'meta_planificada' => 30000.00,
                'estado' => true,
            ]
        );

        MetaTrimestral::updateOrCreate(
            [
                'trimestre' => 2,
                'anio' => 2026,
            ],
            [
                'descripcion' => 'Meta de ventas del segundo trimestre',
                'meta_planificada' => 45000.00,
                'estado' => true,
            ]
        );

        MetaTrimestral::updateOrCreate(
            [
                'trimestre' => 3,
                'anio' => 2026,
            ],
            [
                'descripcion' => 'Meta de ventas del tercer trimestre',
                'meta_planificada' => 50000.00,
                'estado' => true,
            ]
        );

        MetaTrimestral::updateOrCreate(
            [
                'trimestre' => 4,
                'anio' => 2026,
            ],
            [
                'descripcion' => 'Meta de ventas del cuarto trimestre',
                'meta_planificada' => 60000.00,
                'estado' => true,
            ]
        );
    }
}
