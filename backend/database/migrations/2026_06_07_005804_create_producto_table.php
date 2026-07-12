<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producto', function (Blueprint $table) {
            $table->char('id_producto', 4)->primary();
            $table->string('num_serie', 15);
            $table->string('nombre', 50);
            $table->string('marca', 50);
            $table->decimal('precio', 8, 2);
            $table->smallInteger('stock_actual');
            $table->tinyInteger('stock_minimo');
            $table->boolean('estado');
            $table->char('ubicacion', 4);
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
