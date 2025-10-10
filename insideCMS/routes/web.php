<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

$modules = DB::table('modules_settings')->select('module_slug','is_active')->get()->keyBy('module_slug');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () use ($modules) {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Роуты для админки
    if ($modules['info'] && $modules['info']->is_active === 1) {
        Route::get('info', [App\Http\Controllers\InfoController::class, 'show'])->name('info');
    }

    Route::get('reviews-admin', [App\Http\Controllers\ReviewsController::class, 'adminShow'])->name('reviews-admin');
    Route::patch('reviews/{review}/publish', [App\Http\Controllers\ReviewsController::class, 'publish'])->name('reviews.publish');
    Route::patch('reviews/{review}/unpublish', [App\Http\Controllers\ReviewsController::class, 'unpublish'])->name('reviews.unpublish');
    Route::delete('reviews/{review}', [App\Http\Controllers\ReviewsController::class, 'destroy'])->name('reviews.destroy');

    // Роуты для новостей
    Route::post('news', [App\Http\Controllers\NewsController::class, 'store'])->name('news.store');
    Route::get('news-admin', [App\Http\Controllers\NewsController::class, 'adminShow'])->name('news-admin');
    Route::get('add-news-admin', [App\Http\Controllers\NewsController::class, 'create'])->name('add-news-admin');
    Route::get('news/{news}/edit', [App\Http\Controllers\NewsController::class, 'edit'])->name('news.edit');
    Route::post('news/{news}', [App\Http\Controllers\NewsController::class, 'update'])->name('news.update');
    Route::delete('news/{news}', [App\Http\Controllers\NewsController::class, 'destroy'])->name('news.destroy');

    // Роуты для статей
    Route::get('articles-admin', [App\Http\Controllers\ArticleController::class, 'adminShow'])->name('articles-admin');
    Route::get('add-article-admin', [App\Http\Controllers\ArticleController::class, 'create'])->name('add-article-admin');
    // Роуты для добавления, редактирования и удаления статей
    Route::post('articles/add', [App\Http\Controllers\ArticleController::class, 'store'])->name('articles.store');
    Route::post('articles/{article}', [App\Http\Controllers\ArticleController::class, 'update'])->name('articles.edit');
    Route::get('articles/{article}/edit', [App\Http\Controllers\ArticleController::class, 'edit'])->name('articles.update');
    Route::delete('articles/{article}', [App\Http\Controllers\ArticleController::class, 'destroy'])->name('articles.destroy');

    // Роуты для настройки модулей
    Route::get('modules-admin', [App\Http\Controllers\ModulesController::class, 'adminShow'])->name('modules-admin');
    Route::post('modules/{module}/active', [App\Http\Controllers\ModulesController::class, 'toggleActive'])->name('modules.toggleActive');
 });

Route::get('reviews', [App\Http\Controllers\ReviewsController::class, 'show'])->name('reviews');
Route::post('reviews', [App\Http\Controllers\ReviewsController::class, 'store'])->name('reviews.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
