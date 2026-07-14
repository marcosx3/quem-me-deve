<?php

namespace App\Repositories;

use App\Models\Parcela;
use App\Repositories\Contracts\ParcelaRepositoryInterface;

class EloquentParcelaRepository extends BaseRepository implements ParcelaRepositoryInterface
{
    public function __construct(Parcela $model)
    {
        parent::__construct($model);
    }

    public function createMany(array $rows): void
    {
        $this->model->newQuery()->insert($rows);
    }
}
