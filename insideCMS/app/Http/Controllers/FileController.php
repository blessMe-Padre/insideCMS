<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FileModel;
use Illuminate\Support\Facades\Log;

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
            return response()->json(['ok' => false, 'message' => 'файл не найден'], 422);
        }

        // сохраняем в storage/app/public
        $stored = $file->store('', 'public');

        // Получаем данные файла
        $originalName = $file->getClientOriginalName();
        $fileName = pathinfo($originalName, PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        // Записывает в базу данных
        $fileModel = FileModel::create([
            'name'      => $fileName,
            'path'      => '/public/' . $stored,
            'extension' => $extension,
            'mime_type' => $file->getMimeType(),
            'size'      => $file->getSize(),
            'alt'       => null,
        ]);

    
        return response()->json([
            'name'        => $fileName,
            'isDirectory' => false,
            'path'        => '/storage/' . $stored,
            'updatedAt'   => now()->toISOString(),
            'size'        => $file->getSize(),
            'mime_type'   => $file->getMimeType(),
            'original'    => $originalName,
        ], 200);
            
    }
    
}
