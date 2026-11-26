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
    Route::get('habit-registers', [HabitRegisterController::class, 'indexByUser']);
    Route::post('habits/{habit}/registers', [HabitRegisterController::class, 'store']);
    Route::post('habits/{habit}/registers/sync', [HabitRegisterController::class, 'sync']);
    Route::put('habits/{habit}/registers/{register}', [HabitRegisterController::class, 'update']);
    Route::delete('habits/{habit}/registers/{register}', [HabitRegisterController::class, 'destroy']);
});
