<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Site_settings;

class SettingsController extends Controller
{

    public function index()
    {
        $settings = Site_settings::all();
        try {
            if($settings!== null) {
                return response()->json([
                    'status' => 'success',
                    'data' => $settings,
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'errors' => ['not found'],
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    public function show(string $slug)
    {
        $settings = Site_settings::where('slug', $slug)->firstOrFail();
        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ], 200);
    }
}
