<?php

namespace App\Services;

use App\Models\Divida;
use App\Models\User;
use App\Repositories\Contracts\DividaRepositoryInterface;
use App\Repositories\Contracts\ParcelaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class DividaService
{
    public function __construct(
        private readonly DividaRepositoryInterface $dividas,
        private readonly ParcelaRepositoryInterface $parcelas,
    ) {
    }

    public function listForUser(User $user, ?string $search, ?string $status): LengthAwarePaginator
    {
        return $this->dividas->paginateForUser($user->id, $search, $status);
    }

    public function createForUser(User $user, array $data): Divida
    {
        $data['user_id'] = $user->id;
        $data['status'] = 'aberta';

        return DB::transaction(function () use ($data) {
            $divida = $this->dividas->create($data);

            $this->parcelas->createMany($this->buildParcelas($divida));

            return $divida;
        });
    }

    /**
     * Apenas descrição e devedor podem ser alterados depois de criada: valor_total, qtd_parcelas
     * e data_primeira_parcela já determinaram o parcelamento gerado na criação, e o status é
     * derivado automaticamente das parcelas (ver ParcelaService::sincronizarStatusDivida).
     */
    public function updateForUser(Divida $divida, array $data): Divida
    {
        $allowed = array_intersect_key($data, array_flip(['devedor_id', 'descricao']));

        return $this->dividas->update($divida, $allowed);
    }

    public function delete(Divida $divida): bool
    {
        return $this->dividas->delete($divida);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildParcelas(Divida $divida): array
    {
        $totalCents = (int) round(((float) $divida->valor_total) * 100);
        $qtdParcelas = $divida->qtd_parcelas;
        $baseCents = intdiv($totalCents, $qtdParcelas);
        $remainderCents = $totalCents % $qtdParcelas;

        $rows = [];

        for ($numero = 1; $numero <= $qtdParcelas; $numero++) {
            $cents = $baseCents + ($numero <= $remainderCents ? 1 : 0);

            $rows[] = [
                'divida_id' => $divida->id,
                'numero' => $numero,
                'valor' => $cents / 100,
                'vencimento' => $divida->data_primeira_parcela->copy()->addMonthsNoOverflow($numero - 1)->toDateString(),
                'status' => 'pendente',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        return $rows;
    }
}
