<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\FileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('articles', ArticleController::class);
    Route::get('/files', [FileController::class, 'index']);
});
