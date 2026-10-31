<?php

namespace App\Modules\Diarios\Diario;

class DiarioService
{
    public function listar()
    {
        return Diario::all();
    }

    public function criar(array $dados)
    {
        return Diario::create($dados);
    }

    public function buscar(int $id)
    {
        return Diario::findOrFail($id);
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