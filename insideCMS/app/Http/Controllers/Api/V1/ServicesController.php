<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Persona;
use App\Models\Component;

class ServicesController extends Controller
{
    public function index()
    {
        $services = Service::with(['components', 'personas'])->get();
        $servicesParsed = $services->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'slug' => $service->slug,
                'description' => $service->description,
                'images' => $service->images,
                'content' => $service->content,
                'components' => $service->components->map(function ($component) {
                    $data = json_decode($component->pivot->data ?? 'null', true);
                    if ($component->type === 'text') {
                        $data = is_array($data) ? ($data[0] ?? null) : $data;
                    }

                    return [
                        'id' => $component->id,
                        'name' => $component->name,
                        'type' => $component->type,
                        'description' => $component->description,
                        'content' => $data,
                    ];
                }),
                'personas' => $service->personas->map(function ($persona) {
                    return [
                        'id' => $persona->id,
                        'name' => $persona->name,
                        'slug' => $persona->slug,
                        'content' => $persona->content,
                    ];
                }),
            ];
        });
        return response()->json([
            'status' => 'success',
            'data' => $servicesParsed,
        ], 200);
    }

    public function show(string $slug)
    {
        $service = Service::with(['components', 'personas'])->where('slug', $slug)->first();

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $serviceParsed = [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'description' => $service->description,
            'images' => $service->images,
            'content' => $service->content,
            'components' => $service->components->map(function ($component) {
                $data = json_decode($component->pivot->data ?? 'null', true);
                if ($component->type === 'text') {
                    $data = is_array($data) ? ($data[0] ?? null) : $data;
                }

                return [
                    'id' => $component->id,
                    'name' => $component->name,
                    'type' => $component->type,
                    'description' => $component->description,
                    'content' => $data,
                ];
            }),
            'personas' => $service->personas->map(function ($persona) {
                return [
                    'id' => $persona->id,
                    'name' => $persona->name,
                    'slug' => $persona->slug,
                    'content' => $persona->content,
                ];
            }),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $serviceParsed,
        ], 200);
    }
}
