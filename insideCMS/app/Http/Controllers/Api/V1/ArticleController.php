<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{

    public function index()
    {
        $articles = Article::all();
        if (!$articles) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Articles not found'],
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => $articles,
        ], 200);
    }

    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Article not found'],
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $article,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
