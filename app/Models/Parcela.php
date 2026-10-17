<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Parcela extends Model
{
    use HasFactory;

    protected $fillable = [
        'divida_id',
        'numero',
        'valor',
        'vencimento',
        'status',
        'pago_em',
    ];

    protected function casts(): array
    {
        return [
            'numero' => 'integer',
            'valor' => 'decimal:2',
            'vencimento' => 'date',
            'pago_em' => 'datetime',
        ];
    }

    public function divida(): BelongsTo
    {
        return $this->belongsTo(Divida::class);
    }

    /**
     * Calcula juros diários pro-rata e multa percentual caso a parcela esteja vencida e pendente.
     *
     * @return array{dias_atraso: int, multa_valor: float, juros_valor: float, valor_atualizado: float}
     */
    public function calcularAcrescimos(?string $dataReferencia = null): array
    {
        $valorOriginal = (float) $this->valor;
        $divida = $this->divida;

        if (! $divida || $this->status === 'paga') {
            return [
                'dias_atraso' => 0,
                'multa_valor' => 0.0,
                'juros_valor' => 0.0,
                'valor_atualizado' => $valorOriginal,
            ];
        }

        $ref = $dataReferencia ? Carbon::parse($dataReferencia) : now();
        $vencimento = $this->vencimento->copy();

        if ($vencimento->isFuture() || $vencimento->isSameDay($ref)) {
            return [
                'dias_atraso' => 0,
                'multa_valor' => 0.0,
                'juros_valor' => 0.0,
                'valor_atualizado' => $valorOriginal,
            ];
        }

        $diasAtraso = (int) $vencimento->diffInDays($ref);

        $multaPercentual = (float) ($divida->multa_percentual ?? 0);
        $jurosMensalPercentual = (float) ($divida->juros_mensal_percentual ?? 0);

        $multaValor = $multaPercentual > 0 ? round($valorOriginal * ($multaPercentual / 100), 2) : 0.0;
        $jurosValor = $jurosMensalPercentual > 0 ? round($valorOriginal * (($jurosMensalPercentual / 100) / 30) * $diasAtraso, 2) : 0.0;

        $valorAtualizado = round($valorOriginal + $multaValor + $jurosValor, 2);

        return [
            'dias_atraso' => $diasAtraso,
            'multa_valor' => $multaValor,
            'juros_valor' => $jurosValor,
            'valor_atualizado' => $valorAtualizado,
        ];
    }
}
