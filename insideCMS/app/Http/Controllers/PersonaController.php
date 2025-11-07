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
            'content' => 'array',
            'content.*' => 'string',
        ]);

        $persona = Persona::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'content' => $request->content,
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

    public function destroy(Persona $persona)
    {
            $persona->delete();
            return redirect()->route('persona-admin')->with('success', 'Персона удалена');
    }
}
