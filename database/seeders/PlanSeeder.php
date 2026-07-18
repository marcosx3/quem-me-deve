<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::query()->upsert([
            ['id' => 1, 'slug' => 'gratuito', 'nome' => 'Gratuito', 'preco_centavos' => 0, 'limite_devedores' => 3, 'limite_dividas' => 6],
            ['id' => 2, 'slug' => 'pro', 'nome' => 'Pro', 'preco_centavos' => 1499, 'limite_devedores' => 10, 'limite_dividas' => 20],
            ['id' => 3, 'slug' => 'premium', 'nome' => 'Premium', 'preco_centavos' => 8990, 'limite_devedores' => null, 'limite_dividas' => null],
        ], ['id'], ['slug', 'nome', 'preco_centavos', 'limite_devedores', 'limite_dividas']);
    }
}
