<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Component::class, 'services_components')
            ->withPivot('data')
            ->withTimestamps();
    }

    public function personas(): BelongsToMany
    {
        return $this->belongsToMany(Persona::class, 'service_personas')
            ->withTimestamps();
    }
}
