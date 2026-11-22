<?php

use App\Modules\Diario\Http\DiarioController;
use App\Modules\Diario\Http\PageController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('diarios', DiarioController::class);
    Route::get('diarios-by-user/{id}', [DiarioController::class, 'indexByUser']);

    Route::get('diarios/{diaryId}/pages', [PageController::class, 'index']);
    Route::post('diarios/{diaryId}/pages', [PageController::class, 'store']);
    Route::get('pages/{pageId}', [PageController::class, 'show']);
    Route::put('pages/{pageId}', [PageController::class, 'update']);
    Route::delete('pages/{pageId}', [PageController::class, 'destroy']);
});
