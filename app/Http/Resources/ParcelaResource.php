<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParcelaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $acrescimos = $this->calcularAcrescimos();

        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'valor' => $this->valor,
            'vencimento' => $this->vencimento->toDateString(),
            'status' => $this->status,
            'pago_em' => $this->pago_em?->toDateTimeString(),
            'vencida' => $this->status === 'pendente' && $this->vencimento->isPast(),
            'dias_atraso' => $acrescimos['dias_atraso'],
            'multa_valor' => $acrescimos['multa_valor'],
            'juros_valor' => $acrescimos['juros_valor'],
            'valor_atualizado' => $acrescimos['valor_atualizado'],
        ];
    }
}
