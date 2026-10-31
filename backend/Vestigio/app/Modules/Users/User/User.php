<?php

namespace App\Modules\Users\User;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        id,
        name,
        email,
        password,
    ];
}