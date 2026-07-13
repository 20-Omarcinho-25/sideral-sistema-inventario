<?php

namespace Database\Seeders;

use App\Models\Entregable;
use Illuminate\Database\Seeder;

class EntregableSeeder extends Seeder
{
    public function run(): void
    {
        Entregable::updateOrCreate(
            [
                'nombre' => 'Documento de análisis funcional',
                'fase' => 'Análisis',
            ],
            [
                'aceptado' => true,
                'fecha_aceptacion' => '2026-01-20 10:00:00',
                'estado' => true,
            ]
        );

        Entregable::updateOrCreate(
            [
                'nombre' => 'Diseño de base de datos',
                'fase' => 'Diseño',
            ],
            [
                'aceptado' => true,
                'fecha_aceptacion' => '2026-02-15 15:30:00',
                'estado' => true,
            ]
        );

        Entregable::updateOrCreate(
            [
                'nombre' => 'Módulo de inventario',
                'fase' => 'Desarrollo',
            ],
            [
                'aceptado' => true,
                'fecha_aceptacion' => '2026-04-10 11:00:00',
                'estado' => true,
            ]
        );

        Entregable::updateOrCreate(
            [
                'nombre' => 'Módulo de ventas',
                'fase' => 'Desarrollo',
            ],
            [
                'aceptado' => false,
                'fecha_aceptacion' => null,
                'estado' => true,
            ]
        );

        Entregable::updateOrCreate(
            [
                'nombre' => 'Ejecución de pruebas integrales',
                'fase' => 'Pruebas',
            ],
            [
                'aceptado' => false,
                'fecha_aceptacion' => null,
                'estado' => true,
            ]
        );

        Entregable::updateOrCreate(
            [
                'nombre' => 'Documento técnico descartado',
                'fase' => 'Documentación',
            ],
            [
                'aceptado' => true,
                'fecha_aceptacion' => '2026-03-12 09:00:00',
                'estado' => false,
            ]
        );
    }
}