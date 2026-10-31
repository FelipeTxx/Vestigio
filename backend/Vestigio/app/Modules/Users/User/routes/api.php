<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Users\User\Http\UserController;

Route::apiResource(
    'users',
    UserController::class
);
Route::get('general-ratings/total-comments', 'GeneralRatingController@getTotalComments');
Route::get('user/show/{id}', [UserController::class, 'store']);