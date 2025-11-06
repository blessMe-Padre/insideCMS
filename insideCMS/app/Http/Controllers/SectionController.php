<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Component;
use App\Models\Section_component;

class SectionController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/sections/sections-admin', [
            'sections' => Section::all(),
        ]);
    }

    public function create()
    {
        $components = Component::all();
        return Inertia::render('admin/sections/add-section', ['components' => $components]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            "description" => "string|max:2000",
        ]);

        $section = Section::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
        ]);

        foreach ($request->elements as $element) {
            $contentJson = json_decode($element['content'], true);

            $elementData = [
                'section_id' => $section->id,
                'component_id' => $element['component_id'],
                'data' => is_array($contentJson)
                    ? $contentJson
                    : [$element['content']],
            ];
            Section_component::create($elementData);
        }

        return redirect()->route('sections-admin')->with('success', 'Раздел создан');
    }


    public function edit(Section $section)
    {
        $section_component = Section_component::query()
         ->select('sc.id', 'sc.data', 'sc.component_id', 'c.type as component_type')
         ->from('section_components as sc')
         ->join('components as c', 'sc.component_id', '=', 'c.id')
         ->where('sc.section_id', $section->id)
         ->get();

        $section_data = [
            'section' => $section,
            'components' => $section_component->toArray(),
        ];

        return Inertia::render('admin/sections/edit-section', $section_data);
    }

    public function update(Request $request, Section $section)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            "description" => "string|max:2000",
        ]);

        $section->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
        ]);

        // Удаляем старые компоненты страницы
        Section_component::where('section_id', $section->id)->delete();

        // Добавляем новые компоненты, если они есть
        if ($request->components && is_array($request->components)) {
            foreach ($request->components as $component) {
                $elementData = [
                    'section_id' => $section->id,
                    'component_id' => $component['component_id'],
                    'data' => $component['data'],
                ];
                Section_component::create($elementData);
            }
        }

        return redirect()->route('sections-admin')->with('success', 'Раздел обновлен');
    }

    public function destroy(Section $section)
    {
            $section->delete();
            return redirect()->route('sections-admin')->with('success', 'Раздел удален');
    }
}
