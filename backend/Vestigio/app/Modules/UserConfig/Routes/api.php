<?php

use Illuminate\Support\Facades\Route;
use App\Modules\UserConfig\Http\UserConfigController;

Route::apiResource(
    'user_configs',
    UserConfigController::class
);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user_configs_by_user/{id}', [UserConfigController::class, 'getByUserId']);
});
