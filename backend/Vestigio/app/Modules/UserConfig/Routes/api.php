<?php

use Illuminate\Support\Facades\Route;
use App\Modules\UserConfig\Http\UserConfigController;

Route::apiResource(
    'user_configs',
    UserConfigController::class
);
