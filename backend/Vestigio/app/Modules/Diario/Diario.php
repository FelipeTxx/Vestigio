<?php

namespace App\Modules\Diario;

use Illuminate\Database\Eloquent\Model;

class Diario extends Model
{
    protected $table = 'diaries';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'icon',
        'color',
    ];

    public function pages()
    {
        return $this->hasMany(Page::class, 'diary_id');
    }
}
