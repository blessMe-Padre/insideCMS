<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Page;
use App\Models\Component;
use App\Models\Page_component;

class PageController extends Controller
{

    public function adminShow()
    {
        return Inertia::render('admin/pages/pages-admin', [
            'pages' => Page::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $components = Component::all();
        return Inertia::render('admin/pages/add-pages', ['components' => $components]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            "description" => "string|max:2000",
        ]);

        $page = Page::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
        ]);


        foreach ($request->elements as $element) {
            $contentJson = json_decode($element['content'], true);

            $elementData = [
                'page_id' => $page->id,
                'component_id' => $element['component_id'],
                'data' => is_array($contentJson)
                    ? $contentJson
                    : [$element['content']],
            ];
            Page_component::create($elementData);
        }

        return redirect()->route('pages-admin')->with('success', 'Страница создана');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        $page_component = Page_component::query()
         ->select('pc.id', 'pc.data', 'pc.component_id', 'c.type as component_type')
         ->from('page_components as pc')
         ->join('components as c', 'pc.component_id', '=', 'c.id')
         ->where('pc.page_id', $page->id)
         ->get();

        $page_data = [
            'page' => $page,
            'components' => $page_component->toArray(),
        ];

        return Inertia::render('admin/pages/edit-page', $page_data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            "description" => "string|max:2000",
        ]);

        $page->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
        ]);

        // Удаляем старые компоненты страницы
        Page_component::where('page_id', $page->id)->delete();

        // Добавляем новые компоненты, если они есть
        if ($request->components && is_array($request->components)) {

            foreach ($request->components as $component) {
                $elementData = [
                    'page_id' => $page->id,
                    'component_id' => $component['component_id'],
                    'data' => json_decode($component['data'], true),
                ];
                Page_component::create($elementData);
            }
        }

        return redirect()->route('pages-admin')->with('success', 'Страница обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
            $page->delete();
            return redirect()->route('pages-admin')->with('success', 'Страница удалена');
    }
}
