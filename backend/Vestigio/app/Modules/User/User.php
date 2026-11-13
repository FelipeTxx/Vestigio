<?php

namespace App\Modules\User;

use Illuminate\Database\Eloquent\Model;
use HasApiTokens, HasFactory, Notifiable;
class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed'
        ];
    }
}