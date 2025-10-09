<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function adminShow()
    {
        $articles = Article::paginate(6);

        return Inertia::render('admin/articles-admin', [
            'articles' => $articles->items(),
            'links' => $articles->linkCollection()->toArray(),
            'current_page' => $articles->currentPage(),
            'total_pages' => $articles->lastPage(),
            'per_page' => $articles->perPage(),
            'total' => $articles->total(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/add-article-admin');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $article = Article::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'slug' => $validated['slug'],

        ]);

        if ($request->hasFile('images')) {

            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('', 'public');
                $imagePaths[] = $path;
            }
            $article->images = $imagePaths;
            $article->save();
        }

        return redirect()->back()->with('success', 'Статья успешно создана');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        return Inertia::render('admin/edit-article-admin', ['article' => $article]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'slug' => 'required|string|max:255|unique:articles,slug,' . $article->id,
            'images.*' => 'nullable|image|max:2048',
        ]);

        $article->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'slug' => $validated['slug'],
        ]);
        
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('', 'public');
                $imagePaths[] = $path;
            }
            $article->images = $imagePaths;
            $article->save();
        }
        return redirect()->route('articles-admin')->with('success', 'Статья успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->back()->with('success', 'Статья удалена.');
    }
}
