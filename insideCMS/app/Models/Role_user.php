<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Эта таблица будет использоваться для связи между ролями и пользователями
 */
class Role_user extends Model
{
    protected $table = 'role_user';

    protected $fillable = ['role_id', 'user_id'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
