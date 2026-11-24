<?php

namespace App\Modules\Habit;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Habit extends Model
{
    protected $table = 'user_habits';

    protected $fillable = [
        'user_id',
        'habit_type_id',
        'name',
        'color',
        'icon',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(HabitType::class, 'habit_type_id');
    }

    public function registers(): HasMany
    {
        return $this->hasMany(HabitRegister::class, 'habit_id');
    }
}
