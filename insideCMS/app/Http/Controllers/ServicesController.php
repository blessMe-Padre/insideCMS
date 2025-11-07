<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Component;
use App\Models\Services_components;
use Illuminate\Support\Facades\DB;

class ServicesController extends Controller
{
    public function index()
    {
        $services = Service::paginate(10);

        return Inertia::render('admin/services/services-admin', [
            'services' => $services->items(),
            'links' => $services->linkCollection()->toArray(),
            'current_page' => $services->currentPage(),
            'total_pages' => $services->lastPage(),
            'per_page' => $services->perPage(),
            'total' => $services->total(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/services/add-services', [
            'components' => Component::all(),
            'services' => Service::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:services,slug',
            'description' => 'nullable|string|max:255',
            'parentId' => 'nullable|integer|exists:services,id',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'content' => 'nullable|array',
            'content.*' => 'string',
            // элементы конструктора
            'elements' => 'sometimes|array',
            'elements.*.component_id' => 'required|integer|exists:components,id',
            'elements.*.content' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            $service = Service::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'parentId' => $validated['parentId'] ?? null,
                'images' => $validated['images'] ?? [],
                'content' => $validated['content'] ?? [],
            ]);

            $elements = $validated['elements'] ?? [];
            foreach ($elements as $element) {
                $rawContent = $element['content'] ?? '';
                $decoded = null;
                if (is_string($rawContent)) {
                    $decoded = json_decode($rawContent, true);
                }

                $data = is_array($decoded)
                    ? $decoded
                    : ($rawContent === '' ? [] : [$rawContent]);

                Services_components::create([
                    'service_id' => $service->id,
                    'component_id' => (int) $element['component_id'],
                    'data' => $data,
                ]);
            }
        });

        return redirect()->route('services-admin')->with('success', 'Услуга создана');
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
    public function edit(string $id)
    {
        //
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
    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services-admin')->with('success', 'Услуга удалена');
    }
}
