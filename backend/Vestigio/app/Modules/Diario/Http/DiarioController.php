<?php

namespace App\Modules\Diario\Http;

use App\Http\Controllers\Controller;
use App\Modules\Diario\DiarioService;
use Illuminate\Http\Request;

class DiarioController extends Controller
{
    public function __construct(
        private DiarioService $service
    ) {}

    public function index(Request $request)
    {
        return response()->json(
            $this->service->listarPorUsuario($request->user()->id)
        );
    }

    /**
     * Compatibilidade temporária com versões antigas do frontend.
     * O usuário da sessão é sempre usado como escopo; o ID da URL é ignorado.
     */
    public function indexByUser(Request $request, int $id)
    {
        return $this->index($request);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'diario.title' => ['required', 'string', 'max:255'],
            'diario.description' => ['nullable', 'string'],
            'diario.icon' => ['sometimes', 'string', 'max:80'],
            'diario.color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $diario = $this->service->criar([
            ...$dados['diario'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($diario->loadCount('pages'), 201);
    }

    public function show(Request $request, int $id)
    {
        return response()->json(
            $this->service->buscarDoUsuario($id, $request->user()->id)->loadCount('pages')
        );
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            'diario.title' => ['sometimes', 'required', 'string', 'max:255'],
            'diario.description' => ['sometimes', 'nullable', 'string'],
            'diario.icon' => ['sometimes', 'string', 'max:80'],
            'diario.color' => ['sometimes', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        return response()->json(
            $this->service->atualizar($id, $request->user()->id, $dados['diario'] ?? [])
        );
    }

    public function destroy(Request $request, int $id)
    {
        $this->service->excluir($id, $request->user()->id);

        return response()->noContent();
    }
}
