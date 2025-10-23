<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\FileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('news', NewsController::class);
    Route::get('news/{slug}', [NewsController::class, 'show']);
    Route::apiResource('articles', ArticleController::class);
    Route::get('articles/{slug}', [ArticleController::class, 'show']);
    Route::apiResource('pages', PageController::class);
    Route::get('pages/{slug}', [PageController::class, 'show']);
    Route::get('/files', [FileController::class, 'index']);
});
