<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonaController extends Controller
{
    public function index()
    {
        $persons = Persona::paginate(6);

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
        return Inertia::render('admin/pensona/add-person');
    }
}
