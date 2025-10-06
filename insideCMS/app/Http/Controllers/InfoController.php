<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InfoController extends Controller
{
    /**
     * Show the user info page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('info', [
            'user' => $request->user(),
        ]);
    }
}
