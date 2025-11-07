<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Component extends Model
{
    protected $fillable = ['type', 'name', 'description'];

    public function pages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'page_components')
            ->withPivot('data')
            ->withTimestamps();
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'section_components')
            ->withPivot('data')
            ->withTimestamps();
    }

    public function personas(): BelongsToMany
    {
        return $this->belongsToMany(Persona::class, 'personas_components')
            ->withPivot('data')
            ->withTimestamps();
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'services_components')
            ->withPivot('data')
            ->withTimestamps();
    }
}
