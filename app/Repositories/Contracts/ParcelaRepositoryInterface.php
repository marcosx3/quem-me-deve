<?php

namespace App\Repositories\Contracts;

interface ParcelaRepositoryInterface extends RepositoryInterface
{
    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    public function createMany(array $rows): void;
}
