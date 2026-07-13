<?php

namespace App\Repositories\Contracts;

use App\Models\Devedor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DevedorRepositoryInterface extends RepositoryInterface
{
    public function paginateForUser(int $userId, ?string $search, int $perPage = 10): LengthAwarePaginator;

    public function findForUser(int $id, int $userId): ?Devedor;

    public function countForUser(int $userId): int;

    public function slugExistsForUser(int $userId, string $slug, ?int $exceptId = null): bool;
}
