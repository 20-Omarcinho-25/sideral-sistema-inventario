<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venta', function (Blueprint $table) {
            $table->id('id_venta');
            $table->dateTime('fecha_venta');
            $table->decimal('total', 10, 2);
            $table->string('estado', 50);
            $table->string('nombre_cliente', 100);
            $table->string('dni_cliente', 15);

            $table->unsignedBigInteger('id_usuario');

            $table->foreign('id_usuario')
                ->references('id_usuario')
                ->on('usuario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venta');
    }
};