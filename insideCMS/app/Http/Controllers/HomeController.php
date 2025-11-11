<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;

class HomeController extends Controller
{
    public function index()
    {
        $services = Service::with(['components'])->get()->toArray();

        $servicesParsed = array_map(function ($service) {
            $service['components'] = array_map(function ($component) {
                // Парсим внешний JSON из pivot->data
                $data = json_decode($component['pivot']['data'], true);
        
                // Если декодирование не удалось — оставляем как есть
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return $component;
                }
        
                // Проходим по каждому элементу в data и парсим вложенные content-строки
                foreach ($data as &$item) {
                    if (isset($item['content']) && is_string($item['content'])) {
                        $parsedContent = json_decode($item['content'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $item['content'] = $parsedContent;
                        }
                    }
                }
                // Обновляем pivot->data распарсенными данными
                $component['pivot']['data'] = $data;
                return [
                    'type' => $component['type'],
                    'description' => $component['description'],
                    'component_data' => $data,
                ];
            }, $service['components']);
        
            return $service;
        }, $services);

        return Inertia::render('welcome', [
            'services' => $servicesParsed,
        ]);
    }
}
