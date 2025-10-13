<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FileModel;

class FileController extends Controller
{
    public function adminShow()
    {
        $filesData = FileModel::all();
        $files = array_merge([[
            'name' => 'Public',
            'isDirectory' => true,
            'path' => '/public',
            'updatedAt' => '2025-10-10T10:00:00Z',
        ]], $filesData->map(function ($file) {
            return [
                'name' => $file->name .'.'. $file->extension,
                'isDirectory' => false,
                'path' => $file->path,
                'updatedAt' => $file->updated_at,
            ];
        })->toArray());
 
        return Inertia::render('admin/files-admin', [
            'initialFiles' => $files,
        ]);
    }

    public function store(Request $request)
    {
        // файл лежит под ключом "file"
        $file = $request->file('file');
    
        if (!$file) {
            return response()->json(['ok' => false, 'message' => 'file not found'], 422);
        }
    
        // сохраняем в storage/app/public
        $stored = $file->store('', 'public'); // не забудь: php artisan storage:link
    
        return response()->json([
            'name'        => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'isDirectory' => false,
            'path'        => '/storage/' . $stored,   // публичный URL
            'updatedAt'   => now()->toISOString(),
            'size'        => $file->getSize(),
            'mime_type'   => $file->getMimeType(),
            'original'    => $file->getClientOriginalName(),
        ], 200);
    }
    
}
