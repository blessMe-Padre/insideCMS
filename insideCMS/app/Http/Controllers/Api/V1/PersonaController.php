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
        $persons = Persona::all();
        $persons = $persons->map(function ($persona) {
            return [
                'id' => $persona->id,
                'name' => $persona->name,
                'slug' => $persona->slug,
                'images' => $persona->content,
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
        $persona = Persona::where('slug', $slug)->first();

        if (!$persona) {
            return response()->json(['message' => 'Persona not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $persona,
        ], 200);
    }
}
