<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParcelaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'valor' => $this->valor,
            'vencimento' => $this->vencimento->toDateString(),
            'status' => $this->status,
            'pago_em' => $this->pago_em?->toDateTimeString(),
            'vencida' => $this->status === 'pendente' && $this->vencimento->isPast(),
        ];
    }
}
