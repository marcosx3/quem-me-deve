<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ParcelaRepositoryInterface extends RepositoryInterface
{
    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    public function createMany(array $rows): void;

    /**
     * @return array{a_receber: string, recebido: string, vencidas_count: int}
     */
    public function totaisForUser(int $userId): array;

    public function proximasForUser(int $userId, int $limit = 5): Collection;

    public function vencidasForUser(int $userId, int $limit = 5): Collection;
}
