<?php

namespace App\Modules\Diario\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Diario\DiarioService;

class DiarioController extends Controller
{
    public function __construct(
        private DiarioService $service
    ) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function store(Request $request)
    {
        info($request);
        $dados = $request->validate([
            'diario.user_id' => 'required|exists:users,id',
            'diario.title' => 'required|string',
            'diario.content' => 'nullable|string',
        ]);

        return response()->json(
            $this->service->criar($dados['diario']),
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
    
    public function getByUser(int $id){
        return $this->service->getByUser($id);
    }
}