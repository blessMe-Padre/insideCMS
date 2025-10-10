<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ModulesSetting;

class ModulesController extends Controller
{
    public function adminShow()
    {
        return Inertia::render('admin/modules-admin', [
            'modules' => ModulesSetting::all()
            ->keyBy('module_slug')
            ->toArray(),
        ]);
    }

    public function toggleActive(string $id)
    {
        $module = ModulesSetting::findOrFail($id);
        $module->is_active = !$module->is_active;
        $module->save();

        return redirect()->back();
    }
}
