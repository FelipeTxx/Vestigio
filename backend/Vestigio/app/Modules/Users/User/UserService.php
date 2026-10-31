<?php

namespace App\Modules\Users\User;

class UserService
{
    public function listar()
    {
        return User::all();
    }

    public function criar(array $dados)
    {
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
}