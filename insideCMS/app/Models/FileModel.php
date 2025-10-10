<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileModel extends Model
{
    protected $fillable = [
        'name',
        'path',
        'size',
        'metadata',
        'extension',
        'mime_type',
        'alt',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
