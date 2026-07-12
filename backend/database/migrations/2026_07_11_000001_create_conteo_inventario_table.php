<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabla de apoyo para el KPI 1 (Exactitud del Inventario - ERI).
// Registra los conteos físicos de mercadería que el personal realiza
// para compararlos contra el stock que el sistema tiene registrado.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conteo_inventario', function (Blueprint $table) {
            $table->id('id_conteo');
            $table->char('id_producto', 4);
            $table->integer('unidades_contadas');
            $table->dateTime('fecha');
            $table->boolean('estado')->default(true); // eliminación lógica

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('producto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conteo_inventario');
    }
};
