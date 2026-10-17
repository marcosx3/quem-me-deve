<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\SiteAccessLog;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_regular_user_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'email' => 'regular@example.com',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertForbidden();
    }

    public function test_marcos_owner_email_can_access_admin_dashboard(): void
    {
        $owner = User::factory()->create([
            'email' => 'marcos-oliveirasilva@hotmail.com',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($owner)->get(route('admin.dashboard'));

        $response->assertOk();
    }

    public function test_user_with_is_admin_flag_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin-secundario@example.com',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
    }

    public function test_admin_can_update_user_plan(): void
    {
        $admin = User::factory()->create([
            'email' => 'marcos-oliveirasilva@hotmail.com',
            'is_admin' => true,
        ]);

        $targetUser = User::factory()->create([
            'email' => 'cliente@example.com',
            'plan_id' => 1, // Gratuito
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.users.plan', $targetUser->id), [
            'plan_id' => 3, // Upgrade para Premium
        ]);

        $response->assertRedirect();
        $this->assertEquals(3, $targetUser->fresh()->plan_id);
    }

    public function test_track_page_views_middleware_logs_visit(): void
    {
        $this->get(route('home'));

        $this->assertDatabaseHas('site_access_logs', [
            'path' => '/',
            'method' => 'GET',
        ]);
    }
}
