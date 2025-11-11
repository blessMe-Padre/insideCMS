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
        
        $response = Article::whereAny([
            'title', 'slug'
        ], 'like', "%{$query}%")->limit(10)->get();

        // $articlesResponse = Article::select('title', 'slug', DB::raw("'' as description"), DB::raw("'article' as type"))->whereAny([
        //     'title', 'slug'
        // ], 'like', "%{$query}%")->get();

        // $servicesResponse = Service::select('title', 'slug', 'description', DB::raw("'service' as type"))->whereAny([
        //     'title', 'slug', 'description'
        // ], 'like', "%{$query}%")->get();

        // $response = $articlesResponse
        //     ->unionAll($servicesResponse) // Объединяем результаты из двух моделей
        //     ->get();

        return response()->json([
            'status' => 'success',
            'data' => $response,
        ], 200);
    }
}
