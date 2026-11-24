<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('user/show/{id}', function ($id) {
    return response()->json(['success' => true, 'id' => $id]);
});



require_once app_path('Modules/User/Routes/api.php');


require_once app_path('Modules/Diario/Routes/api.php');


require_once app_path('Modules/UserConfig/Routes/api.php');


require_once app_path('Modules/Habit/Routes/api.php');
