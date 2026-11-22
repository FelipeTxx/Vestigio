<?php

namespace App\Modules\Diario;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $table = 'pages';

    protected $fillable = [
        'user_id',
        'diary_id',
        'title',
        'content',
    ];

    public function diary()
    {
        return $this->belongsTo(Diario::class, 'diary_id');
    }
}
