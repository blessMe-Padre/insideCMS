<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SearchController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Роуты для отправки писем
Route::get('/mail', [MailController::class, 'index'])->name('mail');
Route::post('/mail/send', [MailController::class, 'send_email'])->name('mail.send');

Route::get('reviews', [App\Http\Controllers\ReviewsController::class, 'show'])->name('reviews');
Route::post('reviews', [App\Http\Controllers\ReviewsController::class, 'store'])->name('reviews.store');

Route::get('/search', [SearchController::class, 'index'])->name('search');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__ . '/admin.php';

