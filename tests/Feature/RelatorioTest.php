<?php

namespace Tests\Feature;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Parcela;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RelatorioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_authenticated_user_can_view_relatorios_page(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);

        $response = $this->actingAs($user)->get(route('relatorios.index'));

        $response->assertOk();
    }

    public function test_free_user_cannot_export_csv(): void
    {
        $user = User::factory()->create(['plan_id' => 1]); // Gratuito

        $response = $this->actingAs($user)->get(route('relatorios.export.csv'));

        $response->assertForbidden();
    }

    public function test_premium_user_can_export_csv(): void
    {
        $user = User::factory()->create(['plan_id' => 3]); // Premium

        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'Carlos Santana',
            'slug' => 'carlos-santana',
            'telefone' => '11987654321',
        ]);

        $divida = Divida::forceCreate([
            'user_id' => $user->id,
            'devedor_id' => $devedor->id,
            'descricao' => 'Reforma',
            'valor_total' => 200.00,
            'qtd_parcelas' => 1,
            'data_primeira_parcela' => now()->toDateString(),
            'status' => 'aberta',
        ]);

        Parcela::forceCreate([
            'divida_id' => $divida->id,
            'numero' => 1,
            'valor' => 200.00,
            'vencimento' => now()->toDateString(),
            'status' => 'pendente',
        ]);

        $response = $this->actingAs($user)->get(route('relatorios.export.csv'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('Carlos Santana', $content);
        $this->assertStringContainsString('Reforma', $content);
        $this->assertStringContainsString('200,00', $content);
        $this->assertStringContainsString('200,00', $content);
    }
}
