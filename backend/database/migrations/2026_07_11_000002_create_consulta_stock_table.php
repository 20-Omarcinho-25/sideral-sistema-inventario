<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabla de apoyo para el KPI 2 (Tiempo Promedio de Verificación de Stock - TPVS).
// Registra cuántos minutos toma cada consulta/verificación manual de stock.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consulta_stock', function (Blueprint $table) {
            $table->id('id_consulta');
            $table->integer('minutos');
            $table->dateTime('fecha');
            $table->boolean('estado')->default(true); // eliminación lógica
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consulta_stock');
    }
};
