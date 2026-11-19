<?php

namespace App\Modules\UserConfig;

use App\Modules\User\User;
use Illuminate\Database\Eloquent\Model;

class UserConfig extends Model
{
    protected $fillable = [
        'user_id',
        'line_spacing',
        'letter_spacing'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}