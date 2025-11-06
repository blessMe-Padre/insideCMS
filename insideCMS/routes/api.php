<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\Api\V1\MenusController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\SectionController;

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
    Route::apiResource('menus', MenusController::class);
    Route::get('menus/{slug}', [MenusController::class, 'show']);
    Route::apiResource('settings', SettingsController::class);
    Route::apiResource('sections', SectionController::class);
    Route::get('sections/{slug}', [SectionController::class, 'show']);
});
