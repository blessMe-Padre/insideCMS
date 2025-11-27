<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role_user;

class UserSettinsController extends Controller
{

    public function index()
    {
        $users = User::all();
        $roles = Role_user::all();
        $auth_user = auth()->user();
        return Inertia::render('admin/user-settings', [
            'users' => $users,
            'roles' => $roles,
            'auth_user' => $auth_user,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'userRoles' => 'required|array',
        ]);

        foreach ($validated['userRoles'] as $userId => $roleId) {
            Role_user::where('user_id', $userId)->update(['role_id' => $roleId]);
        }
    }

    public function destroy(User $user)
    {
        $roles = Role_user::where('role_id', '=', 1)->get();

        if ($roles->count() === 1) {
            return back()->with('error', 'Нельзя удалить последнего администратора');
        }

        $user->delete();
        return back()->with('success', 'Пользователь успешно удален');
    }
}
