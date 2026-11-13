<?php

namespace App\Modules\User;

use DB;
use Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function __construct(User $model)
    {
        $this->model = $model;
    }
    public function listar()
    {
        return User::all();
    }

    public function criar(array $dados)
    {
        $validade_email = $this->model->where('email', $dados['email'])->exists();
;
        info(isset($validade_email));
        if($validade_email){
            throw ValidationException::withMessages([
                'email' => ['Esse email já está registrado.']
            ]);
        }
        return User::create($dados);
    }

    public function buscar(int $id)
    {
        return User::findOrFail($id);
    }

    public function atualizar(int $id, array $dados)
    {
        $registro = $this->buscar($id);
        $registro->update($dados);

        return $registro;
    }

    public function excluir(int $id)
    {
        return $this->buscar($id)->delete();
    }


    public function bad_login($request){
        $log = $this->model->where('email', $request['email'])->first();
        if ($log && Hash::check($request['password'], $log->password)) {
            return $request;
        } else {
            throw ValidationException::withMessages([
                'error' => ['Email ou Senha incorretos!']
            ]);
        }
    }
}