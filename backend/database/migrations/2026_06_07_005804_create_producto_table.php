<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producto', function (Blueprint $table) {
            $table->id('id_producto');
            $table->string('codigo_producto', 50);
            $table->string('nombre', 150);
            $table->string('marca', 100);
            $table->string('modelo', 100);
            $table->string('procesador', 100);
            $table->string('ram', 50);
            $table->string('almacenamiento', 50);
            $table->string('gpu', 100);
            $table->decimal('precio', 10, 2);
            $table->integer('stock_actual');
            $table->integer('stock_minimo');
            $table->boolean('estado');
            $table->string('ubicacion', 100);
            $table->dateTime('fecha_registro');

            $table->char('id_proveedor', 4);

            $table->foreign('id_proveedor')
                ->references('id_proveedor')
                ->on('proveedor');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producto');
    }
};
