<?php

namespace App\Modules\Diario;

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

    public function getByUser(int $id){
        $query = Diario::where('user_id', $id)->get();
        info($query);
        return $query;
    }
}