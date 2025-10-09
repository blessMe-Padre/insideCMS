<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModulesSetting extends Model
{
    protected $fillable = [
        'module_name',
        'module_description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'module_name' => 'string',
        'module_description' => 'string',
    ];
}
