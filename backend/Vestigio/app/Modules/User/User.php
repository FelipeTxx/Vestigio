<?php

namespace App\Modules\User;

use App\Modules\UserConfig\UserConfig;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // Adiciona os métodos de gerenciamento de tokens do Sanctum.
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    // Criptografa automaticamente a senha ao salvar.
    protected function casts(): array
    {
        return [
            'password' => 'hashed'
        ];
    }

    // Impede que informações sensíveis sejam retornadas no JSON.
    protected $hidden = [
        'password',
        'remember_token'
    ];

    public function userConfig(): HasOne
    {
        return $this->hasOne(UserConfig::class);
    }
}