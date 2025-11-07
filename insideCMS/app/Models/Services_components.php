<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Services_components extends Model
{
    protected $table = 'services_components';

    protected $fillable = [
        'service_id',
        'component_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
