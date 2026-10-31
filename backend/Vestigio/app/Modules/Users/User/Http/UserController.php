<?php

namespace App\Modules\Users\User\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Users\User\UserService;

class UserController extends Controller
{
    public function __construct(
        private UserService $service
    ) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function store(Request $request)
    {
        info("chegou");
        $dados = $request->validate([
            'titulo' => 'required|string|max:255',
            'conteudo' => 'nullable|string',
        ]);

        $dados['user_id'] = $request->user()?->id;

        return response()->json(
            $this->service->criar($dados),
            201
        );
    }

    public function show(int $id)
    {
        return response()->json($this->service->buscar($id));
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'conteudo' => 'nullable|string',
        ]);

        return response()->json(
            $this->service->atualizar($id, $dados)
        );
    }

    public function destroy(int $id)
    {
        $this->service->excluir($id);

        return response()->noContent();
    }
}