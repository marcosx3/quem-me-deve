<?php

namespace Tests\Feature;

use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_home_page_can_be_rendered(): void
    {
        $response = $this->get(route('home'));
        $response->assertOk();
    }

    public function test_termos_page_can_be_rendered(): void
    {
        $response = $this->get(route('termos'));
        $response->assertOk();
    }

    public function test_privacidade_page_can_be_rendered(): void
    {
        $response = $this->get(route('privacidade'));
        $response->assertOk();
    }
}
