<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Devedor extends Model
{
    use HasFactory;

    protected $table = 'devedores';

    protected $fillable = [
        'user_id',
        'nome',
        'slug',
        'telefone',
        'observacoes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dividas(): HasMany
    {
        return $this->hasMany(Divida::class);
    }
}
