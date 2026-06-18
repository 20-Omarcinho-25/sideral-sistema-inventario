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
            // Agregamos index() para que las búsquedas por código o nombre sean ultra rápidas
            $table->string('codigo_producto', 50)->index(); 
            $table->string('nombre', 150)->index();
            $table->string('marca', 100);
            $table->string('modelo', 100);
            $table->string('procesador', 100);
            $table->string('ram', 50);
            $table->string('almacenamiento', 50);
            $table->string('gpu', 100);
            
            // Protección contra valores negativos usando ->unsigned()
            $table->decimal('precio', 10, 2)->unsigned();
            $table->integer('stock_actual')->unsigned();
            $table->integer('stock_minimo')->unsigned();
            
            $table->boolean('estado')->default(1); // 1 = Activo, 0 = Inactivo
            $table->string('ubicacion', 100);
            $table->dateTime('fecha_registro');
            $table->char('id_proveedor', 4);

            $table->foreign('id_proveedor')
                ->references('id_proveedor')
                ->on('proveedor');

            // 🔴 CRÍTICO: Agrega la columna 'deleted_at' para control lógico nativo
            $table->softDeletes(); 
            // timestamps añadidos para tener control de 'created_at' y 'updated_at' (Auditoría)
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('producto');
    }
};