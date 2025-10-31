<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InfoController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('admin/info', [
            'user' => $request->user(),
        ]);
    }
}
