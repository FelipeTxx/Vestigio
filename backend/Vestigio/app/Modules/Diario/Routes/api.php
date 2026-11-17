<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Diario\Http\DiarioController;

Route::apiResource(
    'diarios',
    DiarioController::class
);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/diarios-by-user/{id}', [DiarioController::class, 'getByUser']);
});