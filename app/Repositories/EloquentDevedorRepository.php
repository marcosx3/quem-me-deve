<?php

namespace App\Repositories;

use App\Models\Devedor;
use App\Repositories\Contracts\DevedorRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class EloquentDevedorRepository extends BaseRepository implements DevedorRepositoryInterface
{
    public function __construct(Devedor $model)
    {
        parent::__construct($model);
    }

    /**
     * `user_id` não está em $fillable (de propósito), então usamos forceFill aqui: este é o
     * único caminho confiável de escrita, sempre chamado pelo DevedorService com o user_id do
     * usuário autenticado — nunca com dado bruto de requisição.
     */
    public function create(array $attributes): Model
    {
        $devedor = $this->model->newInstance();
        $devedor->forceFill($attributes);
        $devedor->save();

        return $devedor;
    }

    public function paginateForUser(int $userId, ?string $search, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->when($search, fn ($query) => $query->where('nome', 'like', "%{$search}%"))
            ->orderBy('nome')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findForUser(int $id, int $userId): ?Devedor
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->find($id);
    }

    public function countForUser(int $userId): int
    {
        return $this->model->newQuery()->where('user_id', $userId)->count();
    }

    public function slugExistsForUser(int $userId, string $slug, ?int $exceptId = null): bool
    {
        return $this->model->newQuery()
            ->where('user_id', $userId)
            ->where('slug', $slug)
            ->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))
            ->exists();
    }
}
