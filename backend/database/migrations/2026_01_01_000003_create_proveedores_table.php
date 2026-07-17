<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('proveedor', function (Blueprint $table) {
            $table->char('id_proveedor', 4)->primary();
            $table->string('razon_social', 50);
            $table->string('ruc', 11);
            $table->char('telefono', 9);
            $table->string('correo', 50);
            $table->string('direccion', 50);
            $table->boolean('estado')->default(true);
        });
    }

    public function down(): void { 
        Schema::dropIfExists('proveedor'); 
    }
};
