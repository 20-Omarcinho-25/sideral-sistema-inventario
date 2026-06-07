<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimiento_inventario', function (Blueprint $table) {
            $table->id('id_movimiento');
            $table->string('tipo_movimiento', 50);
            $table->dateTime('fecha_movimiento');
            $table->integer('cantidad');
            $table->string('motivo', 255);

            $table->unsignedBigInteger('id_producto');
            $table->unsignedBigInteger('id_usuario');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('producto');

            $table->foreign('id_usuario')
                ->references('id_usuario')
                ->on('usuario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimiento_inventario');
    }
};