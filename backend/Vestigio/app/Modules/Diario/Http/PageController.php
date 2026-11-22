<?php

namespace App\Modules\Diario\Http;

use App\Http\Controllers\Controller;
use App\Modules\Diario\PageService;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function __construct(
        private PageService $service
    ) {}

    public function index(Request $request, int $diaryId)
    {
        return response()->json(
            $this->service->listarDoDiario($diaryId, $request->user()->id)
        );
    }

    public function store(Request $request, int $diaryId)
    {
        $dados = $request->validate([
            'page.title' => ['required', 'string', 'max:255'],
            'page.content' => ['nullable', 'string'],
        ]);

        return response()->json(
            $this->service->criar($diaryId, $request->user()->id, $dados['page']),
            201
        );
    }

    public function show(Request $request, int $pageId)
    {
        return response()->json(
            $this->service->buscarDoUsuario($pageId, $request->user()->id)
        );
    }

    public function update(Request $request, int $pageId)
    {
        $dados = $request->validate([
            'page.title' => ['sometimes', 'required', 'string', 'max:255'],
            'page.content' => ['sometimes', 'nullable', 'string'],
        ]);

        return response()->json(
            $this->service->atualizar($pageId, $request->user()->id, $dados['page'] ?? [])
        );
    }

    public function destroy(Request $request, int $pageId)
    {
        $this->service->excluir($pageId, $request->user()->id);

        return response()->noContent();
    }
}
