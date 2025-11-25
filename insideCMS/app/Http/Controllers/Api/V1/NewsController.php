<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::all();

        if (!$news) {
            return response()->json([
                'status' => 'error',
                'errors' => ['News not found'],
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ], 200);
    }

    public function show(string $slug)
    {
        $news = News::where('slug', $slug)->first();

        if (!$news) {
            return response()->json([
                'status' => 'error',
                'errors' => ['News not found'],
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $news,
        ], 200);
    }
}
