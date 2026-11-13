<?php

namespace App\Modules\User\Http;

use App\Http\Controllers\Controller;
use App\Jobs\StoreUserJob;
use App\Modules\User\User;
use Hash;
use Illuminate\Http\Request;
use App\Modules\User\UserService;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(
        private UserService $service,
        User $model
    ) {
        $this->model = $model;
    }

    public function index()
    {
        return response()->json($this->service->listar());
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required',
            'password' => 'required',
            'name' => 'required'
        ]);
        
        StoreUserJob::dispatch($dados);

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

    public function bad_login(Request $request){
        $dados = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]); 

         return response()->json(
            $this->service->bad_login($dados),
            201
        );
    }
}