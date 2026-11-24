<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('habit_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')
                ->constrained('user_habits')
                ->cascadeOnDelete();

            $table->text('trigger_text')->nullable();
            $table->timestamp('occurred_at');
            $table->unsignedTinyInteger('intensity');
            $table->timestamps();
        });

        DB::statement(
            'ALTER TABLE habit_registers
             ADD CONSTRAINT habit_registers_intensity_check
             CHECK (intensity BETWEEN 1 AND 5)'
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habit_registers');
    }
};
