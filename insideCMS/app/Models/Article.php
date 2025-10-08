<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title', 'content', 'slug', 'images'];

    protected $casts = [
        'slug' => 'string',
        'title' => 'string',
        'images' => 'array',
    ];

}
