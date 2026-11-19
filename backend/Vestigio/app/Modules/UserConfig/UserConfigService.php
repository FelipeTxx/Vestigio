<?php

namespace App\Modules\UserConfig;

class UserConfigService
{
    public function listar()
    {
        return UserConfig::all();
    }

    public function criar(array $dados)
    {
        return UserConfig::create($dados);
    }

    public function buscar(int $id)
    {
        return UserConfig::findOrFail($id);
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