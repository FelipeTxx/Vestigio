<?php

namespace App\Modules\UserConfig\Http;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\UserConfig\UserConfigService;

class UserConfigController extends Controller
{
    public function __construct(
        private UserConfigService $service
    ) {}

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            
        ]);

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
