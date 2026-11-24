<?php

namespace App\Modules\Habit;

class HabitTypeService
{
    public function listarPorUsuario(int $userId)
    {
        return HabitType::query()->where('user_id', $userId)->orderBy('name')->get();
    }

    public function criar(int $userId, array $dados): HabitType
    {
        return HabitType::create([...$dados, 'user_id' => $userId]);
    }

    public function atualizar(int $id, int $userId, array $dados): HabitType
    {
        $type = $this->buscarDoUsuario($id, $userId);
        $type->update($dados);

        return $type->refresh();
    }

    public function excluir(int $id, int $userId): void
    {
        $this->buscarDoUsuario($id, $userId)->delete();
    }

    private function buscarDoUsuario(int $id, int $userId): HabitType
    {
        return HabitType::query()->where('user_id', $userId)->findOrFail($id);
    }
}
