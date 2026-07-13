<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Divida extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'devedor_id',
        'descricao',
        'valor_total',
        'qtd_parcelas',
        'data_primeira_parcela',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'valor_total' => 'decimal:2',
            'qtd_parcelas' => 'integer',
            'data_primeira_parcela' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function devedor(): BelongsTo
    {
        return $this->belongsTo(Devedor::class);
    }

    public function parcelas(): HasMany
    {
        return $this->hasMany(Parcela::class);
    }
}
