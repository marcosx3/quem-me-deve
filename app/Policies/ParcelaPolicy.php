<?php

namespace App\Policies;

use App\Models\Parcela;
use App\Models\User;

class ParcelaPolicy
{
    public function update(User $user, Parcela $parcela): bool
    {
        return $user->id === $parcela->divida->user_id;
    }
}
