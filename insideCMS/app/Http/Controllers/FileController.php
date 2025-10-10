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
        $file = $request->file('file');
        dd($file);

        $fileModel = FileModel::create([
            'name' => $file->name,
            'path' => $file->path,
            'extension' => $file->extension,
            'mime_type' => $file->mime_type,
            'size' => $file->size,
        ]);

        $fileModel->save();
        return response()->json(['message' => 'File uploaded successfully']);
    }
}
