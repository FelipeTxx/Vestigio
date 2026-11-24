<?php

namespace App\Modules\Habit\Http;

use App\Http\Controllers\Controller;
use App\Modules\Habit\HabitRegisterService;
use Illuminate\Http\Request;

class HabitRegisterController extends Controller
{
    public function __construct(private HabitRegisterService $service) {}

    public function index(Request $request, int $habit)
    {
        return response()->json($this->service->listarDoHabit($habit, $request->user()->id));
    }

    public function store(Request $request, int $habit)
    {
        $dados = $request->validate([
            'register.trigger_text' => ['nullable', 'string'],
            'register.occurred_at' => ['required', 'date'],
            'register.intensity' => ['required', 'integer', 'between:1,5'],
        ]);

        return response()->json(
            $this->service->criar($habit, $request->user()->id, $dados['register']),
            201
        );
    }

    public function update(Request $request, int $habit, int $register)
    {
        $dados = $request->validate([
            'register.trigger_text' => ['sometimes', 'nullable', 'string'],
            'register.occurred_at' => ['sometimes', 'required', 'date'],
            'register.intensity' => ['sometimes', 'required', 'integer', 'between:1,5'],
        ]);

        return response()->json(
            $this->service->atualizar($habit, $register, $request->user()->id, $dados['register'] ?? [])
        );
    }

    public function findRegisterByUserId(int $user_id) {
        info($user_id);
        return $this->service->findRegisterByUserId($user_id);
    }

    public function destroy(Request $request, int $habit, int $register)
    {
        $this->service->excluir($habit, $register, $request->user()->id);

        return response()->noContent();
    }
}
