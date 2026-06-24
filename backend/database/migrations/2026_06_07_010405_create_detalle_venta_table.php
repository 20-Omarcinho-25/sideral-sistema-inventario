<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_venta', function (Blueprint $table) {
            $table->char('id_detalle', 5)->primary();

            $table->char('id_venta', 4);
            $table->char('id_producto', 4);

            $table->smallInteger('cantidad');
            $table->decimal('precio_unitario', 8, 2);
            $table->decimal('subtotal', 10, 2);

            $table->foreign('id_venta')
                ->references('id_venta')
                ->on('venta');

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('producto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_venta');
    }
};
