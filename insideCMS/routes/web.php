<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\FileController;
use App\Http\Controllers\ModulesController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\MenuController;
$modules = getModules();

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Роуты для отправки писем
Route::get('/mail', [MailController::class, 'index'])->name('mail');
Route::post('/mail/send', [MailController::class, 'send_email'])->name('mail.send');

Route::middleware(['auth', 'verified'])->group(function () use ($modules) {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Роуты для админки
    if ($modules['info'] && $modules['info']['is_active']) {
        Route::get('info', [App\Http\Controllers\InfoController::class, 'show'])->name('info');
    }

    if ($modules['reviews'] && $modules['reviews']['is_active']) {
        Route::controller(ReviewsController::class)->group(function () {
            Route::get('reviews-admin', 'adminShow')->name('reviews-admin');
            Route::patch('reviews/{review}/publish', 'publish')->name('reviews.publish');
            Route::patch('reviews/{review}/unpublish', 'unpublish')->name('reviews.unpublish');
            Route::delete('reviews/{review}', 'destroy')->name('reviews.destroy');
        });
    }

    // Роуты для новостей
    if ($modules['news'] && $modules['news']['is_active']) {
        Route::controller(NewsController::class)->group(function () {
            Route::post('news', 'store')->name('news.store');
            Route::get('news-admin', 'adminShow')->name('news-admin');
            Route::get('add-news-admin', 'create')->name('add-news-admin');
            Route::get('news/{news}/edit', 'edit')->name('news.edit');
            Route::post('news/{news}', 'update')->name('news.update');
            Route::delete('news/{news}', 'destroy')->name('news.destroy');
        });
    }
    // Роуты для статей
    if ($modules['articles'] && $modules['articles']['is_active']) {
        Route::controller(ArticleController::class)->group(function () {
            Route::get('articles-admin', 'adminShow')->name('articles-admin');
            Route::get('add-article-admin', 'create')->name('add-article-admin');
            // Роуты для добавления, редактирования и удаления статей
            Route::post('articles/add', 'store')->name('articles.store');
            Route::post('articles/{article}', 'update')->name('articles.edit');
            Route::get('articles/{article}/edit', 'edit')->name('articles.update');
            Route::delete('articles/{article}', 'destroy')->name('articles.destroy');

        });
    }

    // Роуты для настройки модулей
    Route::controller(ModulesController::class)->group(function () {
        Route::get('modules-admin', 'adminShow')->name('modules-admin');
        Route::post('modules/{module}/active', 'toggleActive')->name('modules.toggleActive');
    });

    // Роуты для файлов
    Route::controller(FileController::class)->group(function () {
        Route::get('files-admin', 'adminShow')->name('files-admin');
        Route::post('files-upload', 'store')->name('files.store');
        Route::delete('files-delete', 'destroy')->name('files.destroy');
        Route::get('files-download', 'download')->name('files.download');
    });

    // Роуты для страниц
    Route::controller(PageController::class)->group(function () {
        Route::get('pages-admin', 'adminShow')->name('pages-admin'); // Список страниц (страница списка страниц)
        Route::get('add-pages', 'create')->name('add-pages'); // Создание страницы (страница создания страницы)
        Route::delete('pages/{page}', 'destroy')->name('pages.destroy'); // Удаление страницы (действие удаления страницы)
        Route::post('pages', 'store')->name('pages.store'); // Сохранение созданой страницы (действие создания страницы)
        Route::get('pages/{page}/edit', 'edit')->name('pages.edit'); // Редактирование страницы (страница редактирования)
        Route::post('pages/{page}', 'update')->name('pages.update'); // Обновление страницы (действие обновления страницы)
    });

    // Роуты для настроек сайта
    Route::controller(SettingsController::class)->group(function () {
        Route::get('site-settings', 'index')->name('site-settings');
        Route::post('site-settings', 'update')->name('site-settings.update');
    });

    // Роуты для меню
    Route::controller(MenuController::class)->group(function () {
        Route::get('menu-admin', 'index')->name('menu-admin');
        Route::get('add-menu-admin', 'create')->name('add-menu-admin');
        Route::get('edit-menu-admin/{menu}', 'edit')->name('edit-menu-admin');
        Route::post('menus', 'store')->name('menus.store');
        Route::post('menus/{menu}', 'update')->name('menus.update');
        Route::delete('menus/{menu}', 'destroy')->name('menus.destroy');
    });
 });


Route::get('reviews', [App\Http\Controllers\ReviewsController::class, 'show'])->name('reviews');
Route::post('reviews', [App\Http\Controllers\ReviewsController::class, 'store'])->name('reviews.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
