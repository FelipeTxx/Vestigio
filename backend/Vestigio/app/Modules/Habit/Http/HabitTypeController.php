<?php

namespace App\Modules\Habit\Http;

use App\Http\Controllers\Controller;
use App\Modules\Habit\HabitTypeService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HabitTypeController extends Controller
{
    public function __construct(private HabitTypeService $service) {}

    public function index(Request $request)
    {
        return response()->json($this->service->listarPorUsuario($request->user()->id));
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id;
        $dados = $request->validate([
            'habit_type.name' => ['required', 'string', 'max:255', Rule::unique('habit_types', 'name')->where('user_id', $userId)],
        ]);

        return response()->json($this->service->criar($userId, $dados['habit_type']), 201);
    }

    public function update(Request $request, int $habitType)
    {
        $userId = $request->user()->id;
        $dados = $request->validate([
            'habit_type.name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('habit_types', 'name')->where('user_id', $userId)->ignore($habitType)],
        ]);

        return response()->json(
            $this->service->atualizar($habitType, $userId, $dados['habit_type'] ?? [])
        );
    }

    public function destroy(Request $request, int $habitType)
    {
        $this->service->excluir($habitType, $request->user()->id);

        return response()->noContent();
    }
}
