<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('habit_registers', function (Blueprint $table) {
            $table->foreignId('page_id')
                ->nullable()
                ->constrained('pages')
                ->nullOnDelete();
            $table->jsonb('trigger_content')->nullable();
            $table->unique(
                ['habit_id', 'page_id'],
                'habit_registers_habit_page_unique'
            );
            // Legacy rows keep their old value; new writes use Eloquent updated_at.
            $table->timestamp('occurred_at')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('habit_registers', function (Blueprint $table) {
            $table->dropUnique('habit_registers_habit_page_unique');
            $table->dropConstrainedForeignId('page_id');
            $table->dropColumn('trigger_content');
        });
    }
};
