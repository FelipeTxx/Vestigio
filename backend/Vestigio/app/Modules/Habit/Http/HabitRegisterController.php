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

    public function indexByUser(Request $request)
    {
        return response()->json($this->service->listarDoUsuario($request->user()->id));
    }

    public function store(Request $request, int $habit)
    {
        $dados = $request->validate([
            'register.diary_id' => ['required', 'integer', 'exists:diaries,id'],
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
            'register.diary_id' => ['sometimes', 'required', 'integer', 'exists:diaries,id'],
            'register.trigger_text' => ['sometimes', 'nullable', 'string'],
            'register.occurred_at' => ['sometimes', 'required', 'date'],
            'register.intensity' => ['sometimes', 'required', 'integer', 'between:1,5'],
        ]);

        return response()->json(
            $this->service->atualizar($habit, $register, $request->user()->id, $dados['register'] ?? [])
        );
    }

    public function destroy(Request $request, int $habit, int $register)
    {
        $this->service->excluir($habit, $register, $request->user()->id);

        return response()->noContent();
    }

    public function sync(Request $request, int $habit)
    {
        $dados = $request->validate([
            'register.diary_id' => ['required', 'integer', 'exists:diaries,id'],
            'register.source_key' => ['required', 'string', 'max:100'],
            'register.trigger_text' => ['required', 'string'],
            'register.occurred_at' => ['required', 'date'],
            'register.intensity' => ['required', 'integer', 'between:1,5'],
        ]);

        return response()->json(
            $this->service->sincronizar($habit, $request->user()->id, $dados['register'])
        );
    }
}
