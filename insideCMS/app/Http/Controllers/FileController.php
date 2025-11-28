<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FileModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FileController extends Controller
{
    public function index()
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

        return response()->json($files);
    }

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
        // Валидация входящих данных
        $validator = Validator::make($request->all(), [
            'file' => [
                'required',                      // файл обязателен
                'file',                          // должен быть файлом
                'max:10240',                     // максимум 10 МБ (в килобайтах)
                'mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt,zip,rar,webp,mp4', // допустимые MIME-типы
            ],
        ], [
            'file.required' => 'Файл обязателен для загрузки.',
            'file.file' => 'Поле должно содержать файл.',
            'file.max' => 'Размер файла не должен превышать 10 МБ.',
            'file.mimes' => 'Недопустимый формат файла. Разрешены: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx, txt, zip, rar, webp, mp4.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'ok' => false,
                'message' => $validator->errors()->first('file'),
            ], 422);
        }

        // файл лежит под ключом "file"
        $file = $request->file('file');
    
        if (!$file) {
            return response()->json(['ok' => false, 'message' => 'файл не найден'], 422);
        }

        // Получаем данные файла
        $uniqueId = uniqid();
        $originalName = $file->getClientOriginalName();
        $fileName = transliterateFileName($originalName);
        $extension = $file->getClientOriginalExtension();

        // сохраняем в storage/app/public
        // $stored = $file->store('', 'public');
        $storageFileName = $fileName . $uniqueId . '.' . $extension;
        $stored = $file->storeAs('', $storageFileName, 'public');

        // Записывает в базу данных
        $fileModel = FileModel::create([
            'name'      => $fileName . $uniqueId,
            'path'      => '/public/' . $fileName . $uniqueId . '.' . $extension,
            'extension' => $extension,
            'mime_type' => $file->getMimeType(),
            'size'      => $file->getSize(),
            'alt'       => null,
        ]);

    
        return response()->json([
            'name'        => $fileName . $uniqueId,
            'isDirectory' => false,
            'path'        => '/storage/' . $stored,
            'updatedAt'   => now()->toISOString(),
            'size'        => $file->getSize(),
            'mime_type'   => $file->getMimeType(),
            'original'    => $originalName,
        ], 200);
    }

    public function destroy(Request $request)
    {
        $path = $request->input('path');
        if (!$path) {
            return back()->with('error', 'Путь не указан');
        }
        // Находим файл в базе данных по пути
        $fileModel = FileModel::where('path', $path)->first();

        if (!$fileModel) {
            return back()->with('error', 'Файл не найден в базе данных');
        }

        // Удаляем физический файл из storage/app/public
        $fileName = $fileModel->name . '.' . $fileModel->extension;
        if (Storage::disk('public')->exists($fileName)) {
            Storage::disk('public')->delete($fileName);
        }

        // Удаляем запись из базы данных
        $fileModel->delete();

        return back()->with('success', 'Файл успешно удален');
    }

    public function download(Request $request)
    {
        $path = $request->input('path');
        
        if (!$path) {
            return back()->with('error', 'Путь не указан');
        }

        // Находим файл в базе данных по пути
        $fileModel = FileModel::where('path', $path)->first();

        if (!$fileModel) {
            return back()->with('error', 'Файл не найден в базе данных');
        }

        // Формируем полный путь к файлу
        $fileName = $fileModel->name . '.' . $fileModel->extension;
        $filePath = storage_path('app/public/' . $fileName);

        // Проверяем существование файла
        if (!file_exists($filePath)) {
            return back()->with('error', 'Файл не найден на сервере');
        }

        // Скачиваем файл с оригинальным именем
        return response()->download($filePath, $fileName);
    }
}
