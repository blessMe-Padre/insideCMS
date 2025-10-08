<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\News;

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
            'news' => News::all(),
        ]);
    }

    /**
     * Показать форму создания нового ресурса.
     */
    public function create()
    {
        return Inertia::render('admin/add-news-admin');
    }

    /**
     * Сохраните вновь созданный ресурс в хранилище.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'required|string',
            'slug' => 'required|string|max:255|unique:news,slug',
            'time_to_read' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $news = News::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'excerpt' => $validated['excerpt'],
            'slug' => $validated['slug'],
            'time_to_read' => $validated['time_to_read'],
            'is_published' => $validated['is_published'] ?? false,
        ]);

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('', 'public');
                $imagePaths[] = $path;
            }
            $news->images = $imagePaths;
            $news->save();
        }

        return redirect()->back()->with('success', 'Новость успешно создана');
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
    public function edit(News $news)
    {
        return Inertia::render('admin/edit-news-admin', [
            'news' => $news,
        ]);
    }

    /**
     * Обновить указанный ресурс в хранилище.
     */
    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'required|string',
            'slug' => 'required|string|max:255|unique:news,slug,' . $news->id,
            'time_to_read' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $news->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'excerpt' => $validated['excerpt'],
            'slug' => $validated['slug'],
            'time_to_read' => $validated['time_to_read'],
            'is_published' => $validated['is_published'] ?? false,
        ]);

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('', 'public');
                $imagePaths[] = $path;
            }
            $news->images = $imagePaths;
            $news->save();
        }

        return redirect()->route('news-admin')->with('success', 'Новость успешно обновлена');
    }

    /**
     * Удалить указанный ресурс из хранилища.
     */
    public function destroy(News $news)
    {
        $news->delete();
        return redirect()->back()->with('success', 'Новость удалена.');
    }
}
