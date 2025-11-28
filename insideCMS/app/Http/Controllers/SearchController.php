<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Service;
use App\Models\News;
use App\Models\Persona;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller

{
    public function index(Request $request)
    {
        $query = $request->input('query');
        
        $articlesResponse = Article::query()
        ->select(
            'title',
            DB::raw("'' as description"), // Пустая строка как description чтобы не было ошибки (нужно одинаковое кол-во столбцов в моделях)
            'content',
            DB::raw("'article' as type")) // Добавляем в результат виртуальный столбец type
        ->whereAny([
            'title', 'content'
        ], 'like', "%{$query}%");

        $servicesResponse = Service::query()
        ->select(
            'title',
            'description',
            DB::raw("'' as content"),
            DB::raw("'service' as type"))
        ->whereAny([
            'title', 'description'
        ], 'like', "%{$query}%");

        $newsResponse = News::query()
        ->select(
            'title',
            'excerpt',
            'content',
            DB::raw("'news' as type"))
        ->whereAny([
            'title', 'excerpt', 'content'
        ], 'like', "%{$query}%");

        $personaResponse = Persona::query()
        ->select(
            'name',
            DB::raw("'' as description"),
            DB::raw("'' as content"),
            DB::raw("'personas' as type"))
        ->whereAny([
            'name', 'slug'
        ], 'like', "%{$query}%");

        $unionResponse = $articlesResponse
            ->unionAll($servicesResponse)
            ->unionAll($newsResponse)
            ->unionAll($personaResponse); // Объединяем результаты из двух моделей

        $response = DB::query()
            ->fromSub($unionResponse, 's')
            ->limit(10)
            ->get();

        return Inertia::render('search_result', [
            'results' => $response,
            'query' => $query,
        ]);
    }
}
