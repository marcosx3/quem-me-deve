<?php

namespace App\Services;

use App\Models\Parcela;
use App\Models\User;
use App\Repositories\Contracts\DevedorRepositoryInterface;
use App\Repositories\Contracts\DividaRepositoryInterface;
use App\Repositories\Contracts\ParcelaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class DashboardService
{
    public function __construct(
        private readonly DevedorRepositoryInterface $devedores,
        private readonly DividaRepositoryInterface $dividas,
        private readonly ParcelaRepositoryInterface $parcelas,
    ) {
    }

    public function resumoForUser(User $user): array
    {
        return [
            'devedoresCount' => $this->devedores->countForUser($user->id),
            'dividasCount' => $this->dividas->countForUser($user->id),
            'plano' => [
                'nome' => $user->plan?->nome,
                'limiteDevedores' => $user->plan?->limite_devedores,
                'limiteDividas' => $user->plan?->limite_dividas,
            ],
            'totais' => $this->parcelas->totaisForUser($user->id),
            'proximasParcelas' => $this->formatarParcelas($this->parcelas->proximasForUser($user->id)),
            'parcelasVencidas' => $this->formatarParcelas($this->parcelas->vencidasForUser($user->id)),
        ];
    }

    private function formatarParcelas(Collection $parcelas): array
    {
        return $parcelas->map(fn (Parcela $parcela) => [
            'id' => $parcela->id,
            'divida_id' => $parcela->divida_id,
            'numero' => $parcela->numero,
            'valor' => $parcela->valor,
            'vencimento' => $parcela->vencimento->toDateString(),
            'devedor_nome' => $parcela->divida->devedor->nome,
            'descricao' => $parcela->divida->descricao,
        ])->all();
    }
}
