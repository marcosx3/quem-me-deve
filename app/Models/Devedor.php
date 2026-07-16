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

    /**
     * `user_id` fica de fora de propósito: nunca deve ser preenchido a partir de dados de
     * requisição. Quem cria um Devedor é o EloquentDevedorRepository, via forceFill.
     */
    protected $fillable = [
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
