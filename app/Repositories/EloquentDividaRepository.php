<?php

namespace App\Repositories;

use App\Models\Divida;
use App\Repositories\Contracts\DividaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class EloquentDividaRepository extends BaseRepository implements DividaRepositoryInterface
{
    public function __construct(Divida $model)
    {
        parent::__construct($model);
    }

    public function paginateForUser(int $userId, ?string $search, ?string $status, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('devedor:id,nome')
            ->withCount([
                'parcelas',
                'parcelas as parcelas_pagas_count' => fn ($query) => $query->where('status', 'paga'),
                'parcelas as parcelas_vencidas_count' => fn ($query) => $this->scopeVencidas($query),
            ])
            ->where('user_id', $userId)
            ->when($search, fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('descricao', 'like', "%{$search}%")
                    ->orWhereHas('devedor', fn ($query) => $query->where('nome', 'like', "%{$search}%"));
            }))
            ->when($status === 'vencida', fn ($query) => $query
                ->where('status', 'aberta')
                ->whereHas('parcelas', fn ($query) => $this->scopeVencidas($query)))
            ->when($status && $status !== 'vencida', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    private function scopeVencidas(Builder $query): Builder
    {
        return $query->where('status', 'pendente')->where('vencimento', '<', now()->toDateString());
    }

    public function findForUser(int $id, int $userId): ?Divida
    {
        return $this->model->newQuery()
            ->with('devedor:id,nome')
            ->where('user_id', $userId)
            ->find($id);
    }
}
