<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;

class SectionController extends Controller
{

    public function index()
    {
        return Section::with('components')->get();
    }

    public function show(string $slug)
    {
        $section = Section::with('components')->where('slug', $slug)->firstOrFail();
        $sectionParsed = [
            'id' => $section->id,
            'name' => $section->name,
            'slug' => $section->slug,
            'description' => $section->description,
            'components' => $section->components->map(function ($component) {

                $data = json_decode($component->pivot->data, true);

                if($component->type === 'text') {
                    $data = $data[0];
                } else {
                    $data = $data;
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
            'data' => $sectionParsed,
        ], 200);
    }
}
