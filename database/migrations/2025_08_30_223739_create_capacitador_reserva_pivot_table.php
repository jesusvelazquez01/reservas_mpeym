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
        Schema::create('capacitador_reserva_pivot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capacitador_id')->constrained('capacitadores')->onDelete('cascade');
            $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');

            $table->timestamps();
            $table->unique(['capacitador_id', 'reserva_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capacitador_reserva_pivot');
    }
};
