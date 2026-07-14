<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DividaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'devedor_id' => $this->devedor_id,
            'devedor' => [
                'id' => $this->devedor->id,
                'nome' => $this->devedor->nome,
            ],
            'descricao' => $this->descricao,
            'valor_total' => $this->valor_total,
            'qtd_parcelas' => $this->qtd_parcelas,
            'data_primeira_parcela' => $this->data_primeira_parcela->toDateString(),
            'status' => $this->status,
            'vencida' => $this->status === 'aberta' && ($this->parcelas_vencidas_count ?? 0) > 0,
            'parcelas_count' => $this->whenCounted('parcelas'),
            'parcelas_pagas_count' => $this->whenCounted('parcelas_pagas'),
            'parcelas_vencidas_count' => $this->whenCounted('parcelas_vencidas'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
