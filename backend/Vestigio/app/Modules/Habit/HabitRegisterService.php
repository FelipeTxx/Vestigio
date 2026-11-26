<?php

namespace App\Modules\Habit;

use App\Modules\Diario\Diario;

class HabitRegisterService
{
    public function listarDoHabit(int $habitId, int $userId)
    {
        $this->buscarHabit($habitId, $userId);

        return HabitRegister::query()
            ->where('habit_id', $habitId)
            ->with('diary')
            ->latest('occurred_at')
            ->get();
    }

    public function listarDoUsuario(int $userId)
    {
        return HabitRegister::query()
            ->whereHas('habit', fn ($query) => $query->where('user_id', $userId))
            ->with(['habit', 'diary'])
            ->latest('occurred_at')
            ->get();
    }

    public function criar(int $habitId, int $userId, array $dados): HabitRegister
    {
        $habit = $this->buscarHabit($habitId, $userId);
        $this->buscarDiario((int) $dados['diary_id'], $userId);

        return $habit->registers()->create($dados);
    }

    public function sincronizar(int $habitId, int $userId, array $dados): HabitRegister
    {
        $habit = $this->buscarHabit($habitId, $userId);
        $diario = $this->buscarDiario((int) $dados['diary_id'], $userId);

        $register = HabitRegister::query()->firstOrCreate(
            [
                'habit_id' => $habit->id,
                'diary_id' => $diario->id,
                'source_key' => $dados['source_key'],
            ],
            [
                'trigger_text' => $dados['trigger_text'],
                'occurred_at' => $dados['occurred_at'],
                'intensity' => $dados['intensity'],
            ]
        );

        if (!$register->wasRecentlyCreated) {
            $register->update([
                'trigger_text' => $dados['trigger_text'],
                'intensity' => $dados['intensity'],
            ]);
        }

        return $register->refresh()->load('diary');
    }

    public function atualizar(int $habitId, int $registerId, int $userId, array $dados): HabitRegister
    {
        $register = $this->buscarRegistro($habitId, $registerId, $userId);
        if (isset($dados['diary_id'])) {
            $this->buscarDiario((int) $dados['diary_id'], $userId);
        }
        $register->update($dados);

        return $register->refresh()->load('diary');
    }

    public function excluir(int $habitId, int $registerId, int $userId): void
    {
        $this->buscarRegistro($habitId, $registerId, $userId)->delete();
    }

    private function buscarRegistro(int $habitId, int $registerId, int $userId): HabitRegister
    {
        $this->buscarHabit($habitId, $userId);

        return HabitRegister::query()
            ->where('habit_id', $habitId)
            ->findOrFail($registerId);
    }

    private function buscarHabit(int $habitId, int $userId): Habit
    {
        return Habit::query()->where('user_id', $userId)->findOrFail($habitId);
    }

    private function buscarDiario(int $diaryId, int $userId): Diario
    {
        return Diario::query()->where('user_id', $userId)->findOrFail($diaryId);
    }
}
