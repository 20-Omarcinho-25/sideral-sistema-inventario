<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea la tabla de metas trimestrales.
     */
    public function up(): void
    {
        Schema::create('meta_trimestral', function (Blueprint $table) {
            $table->id('id_meta');

            $table->string('descripcion', 100);

            $table->unsignedTinyInteger('trimestre');

            $table->unsignedSmallInteger('anio');

            $table->decimal('meta_planificada', 10, 2);

            $table->boolean('estado')->default(true);
        });
    }

    /**
     * Elimina la tabla si se revierte la migración.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_trimestral');
    }
};