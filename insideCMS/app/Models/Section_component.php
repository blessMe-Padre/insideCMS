<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section_component extends Model
{
    protected $table = 'section_components';
    
    protected $fillable = ['section_id', 'component_id', 'data'];

    protected $casts = [
        'data' => 'array',
    ];

}
