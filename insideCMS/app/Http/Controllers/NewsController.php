<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Отобразить список ресурса.
     */
    public function index()
    {
        //
    }

    public function adminShow()
    {
        return Inertia::render('admin/news-admin', [
            // 'news' => News::all(),
        ]);
    }

    /**
     * Показать форму создания нового ресурса.
     */
    public function create()
    {
        //
    }

    /**
     * Сохраните вновь созданный ресурс в хранилище.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Отобразить указанный ресурс.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Показать форму редактирования указанного ресурса.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Обновить указанный ресурс в хранилище.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Удалить указанный ресурс из хранилища.
     */
    public function destroy(string $id)
    {
        //
    }
}
