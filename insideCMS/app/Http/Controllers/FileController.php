<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FileController extends Controller
{
    public function adminShow()
    {
        return Inertia::render('admin/files-admin');
    }
}
