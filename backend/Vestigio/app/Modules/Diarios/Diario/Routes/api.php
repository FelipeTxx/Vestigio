<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Diarios\Diario\Http\DiarioController;

Route::apiResource(
    'diarios',
    DiarioController::class
);