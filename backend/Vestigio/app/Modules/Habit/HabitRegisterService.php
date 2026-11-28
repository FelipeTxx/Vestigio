<?php

namespace App\Modules\Habit;

use App\Modules\Diario\Diario;
use App\Modules\Diario\Page;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HabitRegisterService
{
    public function listarDoHabit(int $habitId, int $userId)
    {
        $this->buscarHabit($habitId, $userId);

        return HabitRegister::query()
            ->where('habit_id', $habitId)
            ->with(['diary', 'page'])
            ->latest('updated_at')
            ->get();
    }

    public function listarDoUsuario(int $userId)
    {
        return HabitRegister::query()
            ->whereHas('habit', fn ($query) => $query->where('user_id', $userId))
            ->with(['habit', 'diary', 'page'])
            ->latest('updated_at')
            ->get();
    }

    public function criar(int $habitId, int $userId, array $dados): HabitRegister
    {
        $habit = $this->buscarHabit($habitId, $userId);
        [$diary, $page] = $this->validarContextoDaPagina(
            (int) $dados['diary_id'],
            (int) $dados['page_id'],
            $userId
        );

        return $this->salvarRegistroDaPagina($habit, $diary, $page, $dados);
    }

    /** Sincroniza a fotografia atual das marcações de hábitos de uma página. */
    public function sincronizarPagina(int $diaryId, int $pageId, int $userId, array $registros): array
    {
        return DB::transaction(function () use ($diaryId, $pageId, $userId, $registros) {
            [$diary, $page] = $this->validarContextoDaPagina($diaryId, $pageId, $userId);
            $habitIds = [];
            $salvos = [];

            foreach ($registros as $dados) {
                $habit = $this->buscarHabit((int) $dados['habit_id'], $userId);
                $habitIds[] = $habit->id;
                $salvos[] = $this->salvarRegistroDaPagina($habit, $diary, $page, $dados);
            }

            $obsoletos = HabitRegister::query()->where('page_id', $page->id);
            if ($habitIds !== []) {
                $obsoletos->whereNotIn('habit_id', array_unique($habitIds));
            }
            $obsoletos->delete();

            return collect($salvos)->map(fn (HabitRegister $register) =>
                $register->refresh()->load(['habit', 'diary', 'page'])
            )->all();
        });
    }

    public function atualizar(int $habitId, int $registerId, int $userId, array $dados): HabitRegister
    {
        $register = $this->buscarRegistro($habitId, $registerId, $userId);
        $diaryId = (int) ($dados['diary_id'] ?? $register->diary_id);
        $pageId = (int) ($dados['page_id'] ?? $register->page_id);
        [$diary, $page] = $this->validarContextoDaPagina($diaryId, $pageId, $userId);

        $register->update([
            'diary_id' => $diary->id,
            'page_id' => $page->id,
            ...array_intersect_key($dados, array_flip(['trigger_text', 'trigger_content', 'intensity'])),
        ]);

        return $register->refresh()->load(['habit', 'diary', 'page']);
    }

    public function excluir(int $habitId, int $registerId, int $userId): void
    {
        $this->buscarRegistro($habitId, $registerId, $userId)->delete();
    }

    private function salvarRegistroDaPagina(Habit $habit, Diario $diary, Page $page, array $dados): HabitRegister
    {
        $register = HabitRegister::query()->firstOrNew([
            'habit_id' => $habit->id,
            'page_id' => $page->id,
        ]);

        $register->fill([
            'diary_id' => $diary->id,
            'trigger_text' => $dados['trigger_text'],
            'trigger_content' => $dados['trigger_content'],
            'intensity' => $dados['intensity'] ?? 3,
        ]);
        $register->save();

        return $register;
    }

    private function validarContextoDaPagina(int $diaryId, int $pageId, int $userId): array
    {
        $diary = $this->buscarDiario($diaryId, $userId);
        $page = Page::query()
            ->where('user_id', $userId)
            ->where('diary_id', $diary->id)
            ->findOrFail($pageId);

        return [$diary, $page];
    }

    private function buscarRegistro(int $habitId, int $registerId, int $userId): HabitRegister
    {
        $this->buscarHabit($habitId, $userId);

        return HabitRegister::query()
            ->where('habit_id', $habitId)
            ->whereHas('page', fn ($query) => $query->where('user_id', $userId))
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
