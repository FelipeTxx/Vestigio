<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon', 80)->default('book-outline');
            $table->string('color', 7)->default('#8FAF92');
            $table->timestamps();
        });

        Schema::rename('diarios', 'pages');

        Schema::table('pages', function (Blueprint $table) {
            $table->foreignId('diary_id')
                ->nullable()
                ->constrained('diaries')
                ->cascadeOnDelete();
        });

        $owners = DB::table('pages')
            ->select('user_id')
            ->whereNotNull('user_id')
            ->distinct()
            ->orderBy('user_id')
            ->get();

        foreach ($owners as $owner) {
            $createdAt = DB::table('pages')
                ->where('user_id', $owner->user_id)
                ->min('created_at') ?? now();
            $updatedAt = DB::table('pages')
                ->where('user_id', $owner->user_id)
                ->max('updated_at') ?? $createdAt;

            $diaryId = DB::table('diaries')->insertGetId([
                'user_id' => $owner->user_id,
                'title' => 'Meu diário',
                'description' => null,
                'icon' => 'book-outline',
                'color' => '#8FAF92',
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ]);

            DB::table('pages')
                ->where('user_id', $owner->user_id)
                ->update(['diary_id' => $diaryId]);
        }

        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['diary_id']);
            $table->unsignedBigInteger('diary_id')->nullable(false)->change();
            $table->foreign('diary_id')
                ->references('id')
                ->on('diaries')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('diary_id');
        });

        Schema::dropIfExists('diaries');
        Schema::rename('pages', 'diarios');
    }
};
