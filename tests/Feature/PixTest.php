<?php

namespace Tests\Feature;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Parcela;
use App\Models\User;
use App\Services\PixPayloadService;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PixTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_pix_payload_service_generates_valid_emv_code(): void
    {
        $service = new PixPayloadService();
        $payload = $service->generate(
            chave: '12345678900',
            tipo: 'cpf',
            valor: 50.00,
            nomeRecebedor: 'MARCOS TESTE',
            cidadeRecebedor: 'SAO PAULO'
        );

        $this->assertStringStartsWith('000201', $payload);
        $this->assertStringContainsString('br.gov.bcb.pix', $payload);
        $this->assertStringContainsString('12345678900', $payload);
        $this->assertStringContainsString('50.00', $payload);
        $this->assertStringContainsString('6304', $payload);
    }

    public function test_parcela_pix_endpoint_returns_copia_e_cola_for_premium_user(): void
    {
        $user = User::factory()->create([
            'plan_id' => 3, // Premium
            'chave_pix' => 'pix@example.com',
            'tipo_chave_pix' => 'email',
            'nome_titular_pix' => 'MARCOS TESTE',
        ]);

        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'João',
            'slug' => 'joao',
        ]);

        $divida = Divida::forceCreate([
            'user_id' => $user->id,
            'devedor_id' => $devedor->id,
            'descricao' => 'Serviço',
            'valor_total' => 100.00,
            'qtd_parcelas' => 1,
            'data_primeira_parcela' => now()->toDateString(),
            'status' => 'aberta',
        ]);

        $parcela = Parcela::forceCreate([
            'divida_id' => $divida->id,
            'numero' => 1,
            'valor' => 100.00,
            'vencimento' => now()->toDateString(),
            'status' => 'pendente',
        ]);

        $response = $this->actingAs($user)->getJson(route('parcelas.pix', $parcela->id));

        $response->assertOk()
            ->assertJson([
                'tem_chave' => true,
                'chave_pix' => 'pix@example.com',
                'tipo_chave_pix' => 'email',
                'is_premium' => true,
            ]);

        $this->assertNotEmpty($response->json('copia_e_cola'));
    }
}
