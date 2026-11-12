<?php

use Illuminate\Support\Facades\Route;

Route::get('user/show/{id}', function ($id) {
    return response()->json([
        'success' => true,
        'id' => $id
    ]);
});



require_once app_path('Modules/User/Routes/api.php');
