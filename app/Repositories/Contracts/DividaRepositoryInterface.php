<?php

namespace App\Repositories\Contracts;

use App\Models\Divida;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DividaRepositoryInterface extends RepositoryInterface
{
    public function paginateForUser(int $userId, ?string $search, ?string $status, int $perPage = 10): LengthAwarePaginator;

    public function findForUser(int $id, int $userId): ?Divida;
}
