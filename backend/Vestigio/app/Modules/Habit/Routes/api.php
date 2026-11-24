<?php

use App\Modules\Habit\Http\HabitController;
use App\Modules\Habit\Http\HabitRegisterController;
use App\Modules\Habit\Http\HabitTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('habits', HabitController::class);
    Route::apiResource('habit-types', HabitTypeController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('habits/{habit}/registers', [HabitRegisterController::class, 'index']);
    Route::get('register-by-user-id/{user_id}', [HabitRegisterController::class, 'findRegisterByUserId']);
    Route::post('habits/{habit}/registers', [HabitRegisterController::class, 'store']);
    Route::put('habits/{habit}/registers/{register}', [HabitRegisterController::class, 'update']);
    Route::delete('habits/{habit}/registers/{register}', [HabitRegisterController::class, 'destroy']);

});
