<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::query()->upsert([
            ['id' => 1, 'slug' => 'gratuito', 'nome' => 'Gratuito', 'preco_centavos' => 0, 'limite_devedores' => 3],
            ['id' => 2, 'slug' => 'pro', 'nome' => 'Pro', 'preco_centavos' => 1990, 'limite_devedores' => null],
        ], ['id'], ['slug', 'nome', 'preco_centavos', 'limite_devedores']);
    }
}
