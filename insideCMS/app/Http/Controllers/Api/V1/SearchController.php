<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class SearchController extends Controller

{

    public function index(Request $request)
    {
        $query = $request->input('query');
        
        $articles = Article::when($query, function ($builder) use ($query) {
            return $builder->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('slug', 'like', "%{$query}%");
            });
        })->limit(10)->get();

        return response()->json([
            'status' => 'success',
            'data' => $articles,
        ], 200);
    }
}
