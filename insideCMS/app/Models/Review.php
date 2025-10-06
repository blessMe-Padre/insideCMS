<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'author_name',
        'content',
        'rating',
        'is_published',
    ];

    // Опционально: приведение типов
    protected $casts = [
        'is_published' => 'boolean',
        'rating' => 'integer',
    ];
}