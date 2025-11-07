<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'parentId',
        'slug',
        'title',
        'images',
        'description',
        'content',
    ];

    protected $casts = [
        'images' => 'array',
        'content' => 'array',
    ];
}
