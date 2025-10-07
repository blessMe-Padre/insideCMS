<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Роуты для админки
    Route::get('info', [App\Http\Controllers\InfoController::class, 'show'])->name('info');
    Route::get('reviews-admin', [App\Http\Controllers\ReviewsController::class, 'adminShow'])->name('reviews-admin');
});

Route::get('reviews', [App\Http\Controllers\ReviewsController::class, 'show'])->name('reviews');
Route::post('reviews', [App\Http\Controllers\ReviewsController::class, 'store'])->name('reviews.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
