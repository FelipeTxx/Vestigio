<?php

namespace App\Modules\Habit\Http;

use App\Http\Controllers\Controller;
use App\Modules\Habit\HabitService;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function __construct(private HabitService $service) {}

    public function index(Request $request)
    {
        return response()->json($this->service->listarPorUsuario($request->user()->id));
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'habit.name' => ['required', 'string', 'max:255'],
            'habit.habit_type_id' => ['required', 'integer', 'exists:habit_types,id'],
            'habit.color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'habit.icon' => ['sometimes', 'string', 'max:80'],
        ]);

        return response()->json(
            $this->service->criar($request->user()->id, $dados['habit']),
            201
        );
    }

    public function show(Request $request, int $habit)
    {
        return response()->json($this->service->buscarDoUsuario($habit, $request->user()->id));
    }

    public function update(Request $request, int $habit)
    {
        $dados = $request->validate([
            'habit.name' => ['sometimes', 'required', 'string', 'max:255'],
            'habit.habit_type_id' => ['sometimes', 'required', 'integer', 'exists:habit_types,id'],
            'habit.color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'habit.icon' => ['sometimes', 'string', 'max:80'],
        ]);

        return response()->json(
            $this->service->atualizar($habit, $request->user()->id, $dados['habit'] ?? [])
        );
    }

    public function destroy(Request $request, int $habit)
    {
        $this->service->excluir($habit, $request->user()->id);

        return response()->noContent();
    }
}
