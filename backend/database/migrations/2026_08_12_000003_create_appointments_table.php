<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('professional_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('status')->default('agendado');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['professional_id', 'scheduled_at']);
            $table->index(['patient_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
