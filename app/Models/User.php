<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telefone',
        'plan_id',
        'is_admin',
        'tipo_chave_pix',
        'chave_pix',
        'nome_titular_pix',
        'cidade_titular_pix',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $appends = [
        'is_admin',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'plan_id' => 'integer',
            'is_admin' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return (bool) ($this->attributes['is_admin'] ?? false) || strtolower($this->email ?? '') === 'marcos-oliveirasilva@hotmail.com';
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->isAdmin();
    }

    /**
     * Bridges the stock auth controllers (which read/write a `password` attribute)
     * to the `password_hash` column defined in schema.sql.
     */
    protected function password(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->attributes['password_hash'] ?? null,
            set: fn (string $value) => ['password_hash' => $value],
        );
    }

    public function getAuthPassword(): string
    {
        return $this->attributes['password_hash'];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function devedores(): HasMany
    {
        return $this->hasMany(Devedor::class);
    }

    public function dividas(): HasMany
    {
        return $this->hasMany(Divida::class);
    }
}
