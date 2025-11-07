<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Models\Service_persona;

class PersonaController extends Controller
{
    public function index()
    {
        $persons = Persona::with('components')->get();
        $persons = $persons->map(function ($persona) {
            return [
                'id' => $persona->id,
                'name' => $persona->name,
                'slug' => $persona->slug,
                'content' => $persona->content,
                'components' => $persona->components->map(function ($component) {
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
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $persons,
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $persona = Persona::with('components')->where('slug', $slug)->first();

        if (!$persona) {
            return response()->json(['message' => 'Persona not found'], 404);
        }

        $personaParsed = [
            'id' => $persona->id,
            'name' => $persona->name,
            'slug' => $persona->slug,
            'content' => $persona->content,
            'components' => $persona->components->map(function ($component) {
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
        ];

        return response()->json([
            'status' => 'success',
            'data' => $personaParsed,
        ], 200);
    }
}
