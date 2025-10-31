<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Site_settings extends Model
{
    protected $fillable = [
        'slug',
        'type',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];
}
