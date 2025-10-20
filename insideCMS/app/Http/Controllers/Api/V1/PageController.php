<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;

class PageController extends Controller
{

    public function index()
    {
        return Page::with('components')->get();
    }

    public function show(string $slug)
    {
        $page = Page::with('components')->where('slug', $slug)->firstOrFail();
        $pageParsed = [
            'id' => $page->id,
            'name' => $page->name,
            'slug' => $page->slug,
            'description' => $page->description,
            'components' => $page->components->map(function ($component) {
                
                return [
                    'id' => $component->id,
                    'name' => $component->name,
                    'type' => $component->type,
                    'description' => $component->description,
                    'content' => $component->pivot->data,
                ];
            }),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $pageParsed,
            'meta' => [
                'message' => 'Page fetched successfully',
            ],
        ], 200);
    }

}
