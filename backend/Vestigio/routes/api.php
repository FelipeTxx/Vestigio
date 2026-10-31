<?php

use Illuminate\Support\Facades\Route;

Route::get('user/show/{id}', function ($id) {
    return response()->json([
        'success' => true,
        'id' => $id
    ]);
});