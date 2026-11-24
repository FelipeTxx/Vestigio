<?php

namespace App\Modules\Habit;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\User\User;

class HabitType extends Model
{
    protected $table = 'habit_types';

    protected $fillable = [
        'user_id',
        'name',
        'is_default',
    ];

    protected function casts(): array
    {
        return ['is_default' => 'boolean'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function habits(): HasMany
    {
        return $this->hasMany(Habit::class, 'habit_type_id');
    }
}
