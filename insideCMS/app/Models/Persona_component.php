<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona_component extends Model
{
    protected $table = 'personas_components';
    
    protected $fillable = ['persona_id', 'component_id', 'data'];

    protected $casts = [
        'data' => 'array',
    ];

}
