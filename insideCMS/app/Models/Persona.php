<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Persona extends Model
{

    protected $fillable = [
        'name',
        'slug',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Component::class, 'personas_components')
            ->withPivot('data')
            ->withTimestamps();
    }
}
