<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Service;
use Illuminate\Support\Facades\DB;



class SearchController extends Controller

{

    public function index(Request $request)
    {
        $query = $request->input('query');
        
        // $response = Article::whereAny([
        //     'title', 'slug'
        // ], 'like', "%{$query}%")->limit(10)->get();

        $articlesResponse = Article::query()
        ->select(
            'title',
            'slug',
            DB::raw("'' as description"), // Пустая строка как description чтобы не было ошибки (нужно одинаковое кол-во столбцов в моделях)
            'content',
            DB::raw("'article' as type")) // Добавляем в результат виртуальный столбец type
        ->whereAny([
            'title', 'slug', 'content'
        ], 'like', "%{$query}%");

        $servicesResponse = Service::query()
        ->select(
            'title',
            'slug',
            'description',
            'content',
            DB::raw("'service' as type"))
        ->whereAny([
            'title', 'slug', 'description', 'content'
        ], 'like', "%{$query}%");

        $unionResponse = $articlesResponse
            ->unionAll($servicesResponse); // Объединяем результаты из двух моделей

        $response = DB::query()
            ->fromSub($unionResponse, 's')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $response,
        ], 200);
    }
}
