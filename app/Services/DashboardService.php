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
        return $parcelas->map(function (Parcela $parcela) {
            $acrescimos = $parcela->calcularAcrescimos();

            return [
                'id' => $parcela->id,
                'divida_id' => $parcela->divida_id,
                'numero' => $parcela->numero,
                'valor' => $parcela->valor,
                'vencimento' => $parcela->vencimento->toDateString(),
                'devedor_nome' => $parcela->divida->devedor->nome,
                'devedor_telefone' => $parcela->divida->devedor->telefone,
                'descricao' => $parcela->divida->descricao,
                'dias_atraso' => $acrescimos['dias_atraso'],
                'multa_valor' => $acrescimos['multa_valor'],
                'juros_valor' => $acrescimos['juros_valor'],
                'valor_atualizado' => $acrescimos['valor_atualizado'],
            ];
        })->all();
    }
}
