<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('capacitadores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre',150);
            $table->string('apellido',150);
            $table->string('dni',15)->nullable()->unique();
            $table->string('telefono',150)->nullable();
            $table->string('correo')->nullable()->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capacitadores');
    }
};
