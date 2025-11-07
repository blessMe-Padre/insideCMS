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
    public function edit(Service $service)
    {
         $service_components = Services_components::query()
             ->select('sc.id', 'sc.data', 'sc.component_id', 'c.type as component_type')
             ->from('services_components as sc')
             ->join('components as c', 'sc.component_id', '=', 'c.id')
             ->where('sc.service_id', $service->id)
             ->get();
 
         $data = [
             'service' => $service,
             'components' => $service_components->toArray(),
             'services' => Service::where('id', '!=', $service->id)->get(),
         ];
 
         return Inertia::render('admin/services/edit-services', $data);
     }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:services,slug,' . $service->id,
            'description' => 'nullable|string|max:255',
            'parentId' => 'nullable|integer|exists:services,id',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'content' => 'nullable|array',
            'content.*' => 'string',
            'components' => 'sometimes|array',
            'components.*.id' => 'sometimes|integer|exists:services_components,id',
            'components.*.component_id' => 'required|integer|exists:components,id',
            'components.*.data' => 'nullable',
        ]);

        DB::transaction(function () use ($validated, $service) {
            $service->update([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'parentId' => $validated['parentId'] ?? null,
                'images' => $validated['images'] ?? [],
                'content' => $validated['content'] ?? [],
            ]);

            // Удаляем все существующие компоненты
            Services_components::where('service_id', $service->id)->delete();

            // Создаём новые компоненты
            $components = $validated['components'] ?? [];
            foreach ($components as $component) {
                $data = $component['data'];
                if (is_string($data)) {
                    $decoded = json_decode($data, true);
                    $data = is_array($decoded) ? $decoded : ($data === '' ? [] : [$data]);
                } elseif (!is_array($data)) {
                    $data = $data === '' ? [] : [$data];
                }

                Services_components::create([
                    'service_id' => $service->id,
                    'component_id' => (int) $component['component_id'],
                    'data' => $data,
                ]);
            }
        });

        return redirect()->route('services-admin')->with('success', 'Услуга обновлена');
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
