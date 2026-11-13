<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Http\UserController;

Route::apiResource(
    'users',
    UserController::class
);

Route::get('/show-user/{id}', [UserController::class, 'show']);
Route::post('/create-user', [UserController::class, 'store']);
Route::post('/bad-login', [UserController::class, 'bad_login']);
Route::post('/login', [UserController::class, 'login']);
