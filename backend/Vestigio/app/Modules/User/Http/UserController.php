<?php

namespace App\Modules\User\Http;

use App\Http\Controllers\Controller;
use App\Modules\User\User;
use Hash;
use Illuminate\Http\Request;
use App\Modules\User\UserService;
use Laravel\Sanctum\PersonalAccessToken;

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
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'name' => 'required|string|max:255'
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

    public function bad_login(Request $request){
        $dados = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]); 

         return response()->json(
            $this->service->bad_login($dados),
            201
        );
    }
    public function login(Request $request)
    {
        // Recebe e valida os dados enviados pelo Ionic.
        $dados = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        // Procura o usuário pelo e-mail.
        $user = User::where('email', $dados['email'])->first();

        // Verifica se o usuário existe e se a senha está correta.
        if (!$user || !Hash::check($dados['password'], $user->password)) {
            return response()->json([
                'message' => 'Email ou senha incorretos!'
            ], 401);
        }

        // Gera um token de acesso para o aplicativo.
        // Define a validade no próprio token e também aplica o limite global do Sanctum.
        $token = $user->createToken(
            'ionic-app',
            ['*'],
            now()->addMinute()
        )->plainTextToken;

        // Devolve o token e os dados do usuário ao frontend.
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
}
