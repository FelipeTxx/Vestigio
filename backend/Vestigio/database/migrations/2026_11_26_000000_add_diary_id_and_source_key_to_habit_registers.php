<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('habit_registers', function (Blueprint $table) {
            $table->foreignId('diary_id')
                ->nullable()
                ->after('habit_id')
                ->constrained('diaries')
                ->nullOnDelete();
            $table->string('source_key', 100)->nullable()->after('diary_id');
            $table->unique(
                ['habit_id', 'diary_id', 'source_key'],
                'habit_registers_habit_diary_source_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('habit_registers', function (Blueprint $table) {
            $table->dropUnique('habit_registers_habit_diary_source_unique');
            $table->dropConstrainedForeignId('diary_id');
            $table->dropColumn('source_key');
        });
    }
};
