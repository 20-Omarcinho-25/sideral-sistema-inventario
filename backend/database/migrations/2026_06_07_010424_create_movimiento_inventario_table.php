<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimiento_inventario', function (Blueprint $table) {
            $table->char('id_movimiento', 4)->primary();
            $table->string('tipo_movimiento', 50);
            $table->dateTime('fecha_movimiento');
            $table->tinyInteger('cantidad');

            $table->char('id_producto', 4);
            $table->char('id_usuario', 4);

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
