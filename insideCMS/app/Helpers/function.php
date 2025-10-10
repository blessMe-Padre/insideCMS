<?php

use App\Models\ModulesSetting;

function getModules()
{
    return ModulesSetting::all()->keyBy('module_slug')->toArray();
}