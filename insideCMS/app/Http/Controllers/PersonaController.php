<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Component;
use App\Models\Persona_component;

class PersonaController extends Controller
{
    public function index()
    {
        $persons = Persona::paginate(10);

        return Inertia::render('admin/pensona/persona-admin', [
            'persons' => $persons->items(),
            'links' => $persons->linkCollection()->toArray(),
            'current_page' => $persons->currentPage(),
            'total_pages' => $persons->lastPage(),
            'per_page' => $persons->perPage(),
            'total' => $persons->total(),
        ]);
    }

    public function create()
    {
        $components = Component::all();
        return Inertia::render('admin/pensona/add-person', ['components' => $components]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'images' => 'array',
            'images.*' => 'string',
        ]);

        $persona = Persona::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'images' => $request->images,
        ]);


        foreach ($request->elements as $element) {
            $contentJson = json_decode($element['content'], true);

            $elementData = [
                'persona_id' => $persona->id,
                'component_id' => $element['component_id'],
                'data' => is_array($contentJson)
                    ? $contentJson
                    : [$element['content']],
            ];
            Persona_component::create($elementData);
        }

        return redirect()->route('persona-admin')->with('success', 'Персона создана');
    }

    public function edit(Persona $persona)
    {
        $persona_components = Persona_component::query()
            ->select('pc.id', 'pc.data', 'pc.component_id', 'c.type as component_type')
            ->from('personas_components as pc')
            ->join('components as c', 'pc.component_id', '=', 'c.id')
            ->where('pc.persona_id', $persona->id)
            ->get();

        $components = Component::all();

        $data = [
            'persona' => $persona,
            'components' => $components,
            'personaComponents' => $persona_components->toArray(),
        ];

        return Inertia::render('admin/pensona/edit-person', $data);
    }

    public function update(Request $request, Persona $persona)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'images' => 'array',
            'images.*' => 'string',
        ]);

        $persona->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'content' => $request->content,
        ]);

        // Пересобираем компоненты персоны
        Persona_component::where('persona_id', $persona->id)->delete();

        if ($request->components && is_array($request->components)) {
            foreach ($request->components as $component) {
                $elementData = [
                    'persona_id' => $persona->id,
                    'component_id' => $component['component_id'],
                    'data' => json_decode($component['data'], true),
                ];
                Persona_component::create($elementData);
            }
        }

        return redirect()->route('persona-admin')->with('success', 'Персона обновлена');
    }

    public function destroy(Persona $persona)
    {
            $persona->delete();
            return redirect()->route('persona-admin')->with('success', 'Персона удалена');
    }
}
