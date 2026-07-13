<?php

namespace App\Models;

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
}
