<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('rol', function (Blueprint $table) {
            $table->char('id_rol', 4)->primary();
            $table->string('nombre_rol', 50);
            $table->string('descripcion', 50)->nullable();
        });
    }

    public function down(): void {
        Schema::dropIfExists('rol');
    }
};
