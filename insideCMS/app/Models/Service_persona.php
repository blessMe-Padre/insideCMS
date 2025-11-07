<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service_persona extends Model
{
    protected $fillable = [
        'service_id',
        'persona_id',
    ];
}
