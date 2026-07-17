<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venta', function (Blueprint $table) {
            $table->char('id_venta', 4)->primary();
            $table->dateTime('fecha_venta');
            $table->decimal('total', 10, 2);
            $table->string('estado', 50);
            $table->string('nombre_cliente', 50);
            $table->char('dni_cliente', 8);

             $table->char('id_usuario', 4);

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
