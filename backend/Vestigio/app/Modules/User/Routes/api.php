<?php

use App\Modules\User\Http\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Cadastro e login são as únicas rotas públicas da API.
Route::post('/create-user', [UserController::class, 'store'])->middleware('throttle:5,1');
Route::post('/login', [UserController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/show-user/{id}', [UserController::class, 'show']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', fn (Request $request) => $request->user());
});
