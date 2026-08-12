<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professionals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('specialty_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->index(['specialty_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
