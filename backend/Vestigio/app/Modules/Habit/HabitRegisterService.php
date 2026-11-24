<?php

namespace App\Modules\Habit;

class HabitRegisterService
{
    public function listarDoHabit(int $habitId, int $userId)
    {
        $this->buscarHabit($habitId, $userId);

        return HabitRegister::query()
            ->where('habit_id', $habitId)
            ->latest('occurred_at')
            ->get();
    }

    public function criar(int $habitId, int $userId, array $dados): HabitRegister
    {
        $habit = $this->buscarHabit($habitId, $userId);

        return $habit->registers()->create($dados);
    }

    public function atualizar(int $habitId, int $registerId, int $userId, array $dados): HabitRegister
    {
        $register = $this->buscarRegistro($habitId, $registerId, $userId);
        $register->update($dados);

        return $register;
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

    public function findRegisterByUserId(int $user_id){
         return HabitRegister::query()
            ->whereHas('habit', function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })
            ->get();
    }

    private function buscarHabit(int $habitId, int $userId): Habit
    {
        return Habit::query()->where('user_id', $userId)->findOrFail($habitId);
    }
}
