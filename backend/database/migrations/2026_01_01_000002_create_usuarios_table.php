<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('usuario', function (Blueprint $table) {
            $table->char('id_usuario', 4)->primary();
            $table->string('nombre', 50);
            $table->string('apellido', 50);
            $table->string('username', 50)->unique();
            $table->string('password_hash', 255);
            $table->string('correo', 50);
            $table->boolean('estado')->default(true);
            $table->dateTime('fecha_registro');
            $table->char('id_rol', 4);
            $table->foreign('id_rol')->references('id_rol')->on('rol');
        });
    }

    public function down(): void {
        Schema::dropIfExists('usuario');
    }
};
