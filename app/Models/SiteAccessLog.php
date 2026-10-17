<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteAccessLog extends Model
{
    public $timestamps = false;

    protected $table = 'site_access_logs';

    protected $fillable = [
        'user_id',
        'path',
        'method',
        'ip_hash',
        'user_agent',
        'referer',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
