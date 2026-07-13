<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea la tabla de entregables del proyecto.
     */
    public function up(): void
    {
        Schema::create('entregable', function (Blueprint $table) {
            $table->id('id_entregable');

            $table->string('nombre', 100);

            $table->string('fase', 50);

            $table->boolean('aceptado')->default(false);

            $table->dateTime('fecha_aceptacion')->nullable();

            $table->boolean('estado')->default(true);
        });
    }

    /**
     * Elimina la tabla al revertir la migración.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregable');
    }
};