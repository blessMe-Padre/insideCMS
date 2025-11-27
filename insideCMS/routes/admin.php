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
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\UserSettinsController;

$modules = getModules();

Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminAccess::class])->prefix('admin')->group(function () use ($modules) {
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
            Route::patch('reviews/{review}/change-status', 'changeStatus')->name('reviews.changeStatus');
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

    // Роуты для разделов
    Route::controller(SectionController::class)->group(function () {
        Route::get('sections-admin', 'index')->name('sections-admin');
        Route::get('add-section', 'create')->name('add-section');
        Route::get('sections/{section}/edit', 'edit')->name('sections.edit');
        Route::post('sections/{section}', 'update')->name('sections.update');
        Route::post('sections', 'store')->name('sections.store');
        Route::delete('sections/{section}', 'destroy')->name('sections.destroy');
    });

    // Роуты для персон 
    if ($modules['person'] && $modules['person']['is_active']) {
        Route::controller(PersonaController::class)->group(function () {
            Route::get('persons-admin', 'index')->name('persona-admin');
                Route::get('add-person', 'create')->name('add-person');
                Route::post('persons', 'store')->name('persons.store');
                Route::get('persons/{persona}/edit', 'edit')->name('persons.edit');
                Route::post('persons/{persona}', 'update')->name('persons.update');
                Route::delete('persons/{persona}', 'destroy')->name('persons.destroy');
            });
        }
    
    // Роуты для услуг
    if ($modules['services'] && $modules['services']['is_active']) {
        Route::controller(ServicesController::class)->group(function () {
        Route::get('services-admin', 'index')->name('services-admin');
        Route::get('add-services', 'create')->name('add-services');
        Route::post('services', 'store')->name('services.store');
        Route::get('services/{service}/edit', 'edit')->name('services.edit');
        Route::post('services/{service}', 'update')->name('services.update');
        Route::delete('services/{service}', 'destroy')->name('services.destroy');
        });
    }

    // Роуты для настройки модулей
    Route::middleware(\App\Http\Middleware\AdminOnly::class)->controller(ModulesController::class)->group(function () {
        Route::get('modules-admin', 'adminShow')->name('modules-admin');
        Route::post('modules/{module}/active', 'toggleActive')->name('modules.toggleActive');
    });

    // Роуты для настроек сайта
    Route::middleware(\App\Http\Middleware\AdminOnly::class)->controller(SettingsController::class)->group(function () {
        Route::get('site-settings', 'index')->name('site-settings');
        Route::post('site-settings', 'update')->name('site-settings.update');
    });

    // Роуты для меню
    Route::middleware(\App\Http\Middleware\AdminOnly::class)->controller(MenuController::class)->group(function () {
        Route::get('menu-admin', 'index')->name('menu-admin');
        Route::get('add-menu-admin', 'create')->name('add-menu-admin');
        Route::get('edit-menu-admin/{menu}', 'edit')->name('edit-menu-admin');
        Route::post('menus', 'store')->name('menus.store');
        Route::post('menus/{menu}', 'update')->name('menus.update');
        Route::delete('menus/{menu}', 'destroy')->name('menus.destroy');
    });

    // Роуты для настроек пользователей
    Route::middleware(\App\Http\Middleware\AdminOnly::class)->controller(UserSettinsController::class)->group(function () {
        Route::get('user-settings', 'index')->name('user-settings');
        Route::post('user-settings', 'update')->name('user-settings.update');
        Route::delete('user-settings/{user}', 'destroy')->name('user-settings.destroy');
    });

 });