<?php

namespace App\Providers;

use App\Repositories\Contracts\DevedorRepositoryInterface;
use App\Repositories\Contracts\DividaRepositoryInterface;
use App\Repositories\Contracts\ParcelaRepositoryInterface;
use App\Repositories\EloquentDevedorRepository;
use App\Repositories\EloquentDividaRepository;
use App\Repositories\EloquentParcelaRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(DevedorRepositoryInterface::class, EloquentDevedorRepository::class);
        $this->app->bind(DividaRepositoryInterface::class, EloquentDividaRepository::class);
        $this->app->bind(ParcelaRepositoryInterface::class, EloquentParcelaRepository::class);
    }
}
