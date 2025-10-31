<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Site_settings;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Site_settings::all();
        return Inertia::render('admin/site-settings', [
            'settings' => $settings,
        ]);
    }

    public function attributes(): array
    {
        return [
            'cookie_text' => 'Текст куки',
            'cookie_link' => 'Ссылка куки',
            'emails.*' => 'Почта',
            'ym_code' => 'Код Яндекс Метрики',
        ];
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cookie_text' => 'array',
            'cookie_link' => 'array',
            'emails.*' => 'required|email',
            'ym_code' => 'array',
        ], [
            // кастомные сообщения не требуются
        ], [
            'emails.*' => 'почта',
        ]);

        
        foreach ($validated as $slug => $value) {
            
            $setting = Site_settings::where('slug', $slug)->first();
    
            $setting->update([
                'content' => $validated[$slug],
            ]);
        }

        return redirect()->route('site-settings');
    }
}
