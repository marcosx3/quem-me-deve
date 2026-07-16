<?php

namespace App\Repositories;

use App\Models\Parcela;
use App\Repositories\Contracts\ParcelaRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

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

    public function totaisForUser(int $userId): array
    {
        $base = $this->forUser($userId);

        return [
            'a_receber' => (string) (clone $base)->where('status', 'pendente')->sum('valor'),
            'recebido' => (string) (clone $base)->where('status', 'paga')->sum('valor'),
            'vencidas_count' => (clone $base)->where('status', 'pendente')->where('vencimento', '<', now()->toDateString())->count(),
        ];
    }

    public function proximasForUser(int $userId, int $limit = 5): Collection
    {
        return $this->forUser($userId)
            ->where('status', 'pendente')
            ->where('vencimento', '>=', now()->toDateString())
            ->with(['divida:id,devedor_id,descricao', 'divida.devedor:id,nome'])
            ->orderBy('vencimento')
            ->limit($limit)
            ->get();
    }

    public function vencidasForUser(int $userId, int $limit = 5): Collection
    {
        return $this->forUser($userId)
            ->where('status', 'pendente')
            ->where('vencimento', '<', now()->toDateString())
            ->with(['divida:id,devedor_id,descricao', 'divida.devedor:id,nome'])
            ->orderBy('vencimento')
            ->limit($limit)
            ->get();
    }

    private function forUser(int $userId): Builder
    {
        return $this->model->newQuery()->whereHas('divida', fn ($query) => $query->where('user_id', $userId));
    }
}
