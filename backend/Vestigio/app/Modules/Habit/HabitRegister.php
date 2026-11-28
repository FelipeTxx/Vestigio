<?php

namespace App\Modules\Habit;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Diario\Diario;
use App\Modules\Diario\Page;

class HabitRegister extends Model
{
    protected $table = 'habit_registers';

    protected $fillable = [
        'habit_id',
        'diary_id',
        'page_id',
        'trigger_text',
        'trigger_content',
        'intensity',
    ];

    protected function casts(): array
    {
        return [
            'trigger_content' => 'array',
            'intensity' => 'integer',
        ];
    }

    public function habit(): BelongsTo
    {
        return $this->belongsTo(Habit::class, 'habit_id');
    }

    public function diary(): BelongsTo
    {
        return $this->belongsTo(Diario::class, 'diary_id');
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }
}
