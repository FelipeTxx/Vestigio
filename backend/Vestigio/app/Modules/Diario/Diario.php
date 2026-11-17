<?php

namespace App\Modules\Diario;

use Illuminate\Database\Eloquent\Model;

class Diario extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'content'
    ];
}