<?php

namespace App\Services;

use App\Models\Devedor;
use App\Models\User;
use App\Repositories\Contracts\DevedorRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DevedorService
{
    public function __construct(private readonly DevedorRepositoryInterface $devedores)
    {
    }

    public function listForUser(User $user, ?string $search): LengthAwarePaginator
    {
        return $this->devedores->paginateForUser($user->id, $search);
    }

    public function createForUser(User $user, array $data): Devedor
    {
        $this->ensureWithinPlanLimit($user);

        $data['user_id'] = $user->id;
        $data['slug'] = $this->uniqueSlug($user->id, $data['nome']);

        return $this->devedores->create($data);
    }

    public function updateForUser(User $user, Devedor $devedor, array $data): Devedor
    {
        if ($data['nome'] !== $devedor->nome) {
            $data['slug'] = $this->uniqueSlug($user->id, $data['nome'], $devedor->id);
        }

        return $this->devedores->update($devedor, $data);
    }

    private function ensureWithinPlanLimit(User $user): void
    {
        $limit = $user->plan?->limite_devedores;

        if ($limit === null) {
            return;
        }

        if ($this->devedores->countForUser($user->id) >= $limit) {
            throw ValidationException::withMessages([
                'nome' => "Você atingiu o limite de {$limit} devedores do seu plano atual.",
            ]);
        }
    }

    private function uniqueSlug(int $userId, string $nome, ?int $exceptId = null): string
    {
        $base = Str::slug($nome);
        $slug = $base;
        $suffix = 2;

        while ($this->devedores->slugExistsForUser($userId, $slug, $exceptId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
