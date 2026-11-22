<?php

namespace App\Modules\Diario;

class DiarioService
{
    public function listarPorUsuario(int $userId)
    {
        return Diario::query()
            ->where('user_id', $userId)
            ->withCount('pages')
            ->latest()
            ->get();
    }

    public function criar(array $dados): Diario
    {
        return Diario::create($dados);
    }

    public function buscarDoUsuario(int $id, int $userId): Diario
    {
        return Diario::query()
            ->where('user_id', $userId)
            ->findOrFail($id);
    }

    public function atualizar(int $id, int $userId, array $dados): Diario
    {
        $diario = $this->buscarDoUsuario($id, $userId);
        $diario->update($dados);

        return $diario->refresh()->loadCount('pages');
    }

    public function excluir(int $id, int $userId): void
    {
        $this->buscarDoUsuario($id, $userId)->delete();
    }
}
