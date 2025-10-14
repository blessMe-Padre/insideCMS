<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Page extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Component::class, 'page_components')
            ->withPivot('data')
            ->withTimestamps();
    }
}
