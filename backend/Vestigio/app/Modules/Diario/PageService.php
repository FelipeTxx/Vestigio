<?php

namespace App\Modules\Diario;

class PageService
{
    public function listarDoDiario(int $diaryId, int $userId)
    {
        $this->buscarDiario($diaryId, $userId);

        return Page::query()
            ->where('diary_id', $diaryId)
            ->where('user_id', $userId)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
    }

    public function criar(int $diaryId, int $userId, array $dados): Page
    {
        $this->buscarDiario($diaryId, $userId);

        return Page::create([
            ...$dados,
            'diary_id' => $diaryId,
            'user_id' => $userId,
        ]);
    }

    public function buscarDoUsuario(int $id, int $userId): Page
    {
        return Page::query()
            ->where('user_id', $userId)
            ->findOrFail($id);
    }

    public function atualizar(int $id, int $userId, array $dados): Page
    {
        $page = $this->buscarDoUsuario($id, $userId);
        $page->update($dados);

        return $page;
    }

    public function excluir(int $id, int $userId): void
    {
        $this->buscarDoUsuario($id, $userId)->delete();
    }

    private function buscarDiario(int $diaryId, int $userId): Diario
    {
        return Diario::query()
            ->where('user_id', $userId)
            ->findOrFail($diaryId);
    }
}
