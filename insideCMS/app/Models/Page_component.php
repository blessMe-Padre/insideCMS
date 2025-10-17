<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Page_component extends Model
{
    protected $table = 'page_components';
    
    protected $fillable = ['page_id', 'component_id', 'data'];

    protected $casts = [
        'data' => 'array',
    ];

}
