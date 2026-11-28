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
            'register.page_id' => ['required', 'integer', 'exists:pages,id'],
            'register.trigger_text' => ['required', 'string'],
            'register.trigger_content' => ['required', 'array'],
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
            'register.page_id' => ['sometimes', 'required', 'integer', 'exists:pages,id'],
            'register.trigger_text' => ['sometimes', 'required', 'string'],
            'register.trigger_content' => ['sometimes', 'required', 'array'],
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

    public function syncPage(Request $request, int $diary, int $page)
    {
        $dados = $request->validate([
            'registers' => ['present', 'array'],
            'registers.*.habit_id' => ['required', 'integer', 'distinct:strict', 'exists:user_habits,id'],
            'registers.*.trigger_text' => ['required', 'string'],
            'registers.*.trigger_content' => ['required', 'array'],
            'registers.*.trigger_content.version' => ['required', 'integer', 'in:1'],
            'registers.*.trigger_content.occurrences' => ['required', 'array', 'min:1'],
            'registers.*.trigger_content.occurrences.*.order' => ['required', 'integer', 'min:1'],
            'registers.*.trigger_content.occurrences.*.source_key' => ['required', 'string', 'max:100'],
            'registers.*.trigger_content.occurrences.*.from' => ['required', 'integer', 'min:0'],
            'registers.*.trigger_content.occurrences.*.to' => ['required', 'integer', 'gt:registers.*.trigger_content.occurrences.*.from'],
            'registers.*.trigger_content.occurrences.*.text' => ['required', 'string'],
            'registers.*.trigger_content.occurrences.*.slice' => ['required', 'array'],
            'registers.*.intensity' => ['sometimes', 'integer', 'between:1,5'],
        ]);

        return response()->json(
            $this->service->sincronizarPagina($diary, $page, $request->user()->id, $dados['registers'])
        );
    }
}
