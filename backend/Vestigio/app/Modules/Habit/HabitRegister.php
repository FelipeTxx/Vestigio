<?php

namespace App\Modules\Habit;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Diario\Diario;

class HabitRegister extends Model
{
    protected $table = 'habit_registers';

    protected $fillable = [
        'habit_id',
        'diary_id',
        'source_key',
        'trigger_text',
        'occurred_at',
        'intensity',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
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
}
