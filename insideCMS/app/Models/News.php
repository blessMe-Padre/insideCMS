<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'slug',
        'time_to_read',
        'is_published',
        'images',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'images' => 'array',
        'time_to_read' => 'integer',
    ];
}
