<?php

namespace App\Policies;

use App\Models\Devedor;
use App\Models\User;

class DevedorPolicy
{
    public function view(User $user, Devedor $devedor): bool
    {
        return $user->id === $devedor->user_id;
    }

    public function update(User $user, Devedor $devedor): bool
    {
        return $user->id === $devedor->user_id;
    }
}
