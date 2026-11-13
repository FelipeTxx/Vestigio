<?php

namespace App\Modules\User;

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
}