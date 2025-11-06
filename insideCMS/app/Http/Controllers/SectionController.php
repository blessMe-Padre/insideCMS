<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/sections-admin', [
            'sections' => Section::all(),
        ]);
    }
}
