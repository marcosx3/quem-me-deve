<?php

namespace Tests;

use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * `users.plan_id` é FK obrigatória pra `plans` — sem isso, qualquer teste que cria um User
     * (via RefreshDatabase, que só migra, não semeia) quebra com foreign key violation.
     */
    protected $seed = true;

    protected $seeder = PlanSeeder::class;
}
