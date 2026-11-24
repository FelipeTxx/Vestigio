<?php

namespace App\Modules\Habit;

use Illuminate\Validation\ValidationException;

class HabitService
{
    public function listarPorUsuario(int $userId)
    {
        return Habit::query()
            ->where('user_id', $userId)
            ->with('type')
            ->withCount('registers')
            ->latest()
            ->get();
    }

    public function criar(int $userId, array $dados): Habit
    {
        
        $this->validarTipoDoUsuario($dados['habit_type_id'], $userId);

        return Habit::create([...$dados, 'user_id' => $userId]);
    }

    public function buscarDoUsuario(int $id, int $userId): Habit
    {
        return Habit::query()
            ->where('user_id', $userId)
            ->with('type')
            ->withCount('registers')
            ->findOrFail($id);
    }

    public function atualizar(int $id, int $userId, array $dados): Habit
    {
        $habit = $this->buscarDoUsuario($id, $userId);

        if (isset($dados['habit_type_id'])) {
            $this->validarTipoDoUsuario($dados['habit_type_id'], $userId);
        }

        $habit->update($dados);

        return $habit->refresh()->load('type')->loadCount('registers');
    }

    public function excluir(int $id, int $userId): void
    {
        $this->buscarDoUsuario($id, $userId)->delete();
    }

    private function validarTipoDoUsuario(int $typeId, int $userId): void
    {
        if (!HabitType::query()->where('user_id', $userId)->whereKey($typeId)->exists()) {
            throw ValidationException::withMessages([
                'habit_type_id' => ['O tipo selecionado não pertence ao usuário autenticado.'],
            ]);
        }
    }
}
