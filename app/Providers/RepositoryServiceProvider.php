<?php

namespace App\Providers;

use App\Repositories\Contracts\DevedorRepositoryInterface;
use App\Repositories\EloquentDevedorRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DevedorRepositoryInterface::class, EloquentDevedorRepository::class);
    }
}
