<?php

namespace Tests\Feature;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Plan;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DevedorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_user_can_create_devedor_with_minimal_fields(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);

        $response = $this->actingAs($user)->post(route('devedores.store'), [
            'nome' => 'Seu Zé do Bar',
        ]);

        $response->assertRedirect(route('devedores.index'));
        $this->assertDatabaseHas('devedores', [
            'user_id' => $user->id,
            'nome' => 'Seu Zé do Bar',
            'telefone' => null,
            'observacoes' => null,
        ]);
    }

    public function test_user_can_create_devedor_and_initial_divida_simultaneously(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);

        $response = $this->actingAs($user)->post(route('devedores.store'), [
            'nome' => 'Maria do Pastel',
            'telefone' => '11987654321',
            'valor_inicial' => '150.00',
            'descricao_inicial' => 'Pastéis da festa',
        ]);

        $response->assertRedirect(route('dividas.index'));

        $devedor = Devedor::where('user_id', $user->id)->where('nome', 'Maria do Pastel')->first();
        $this->assertNotNull($devedor);

        $this->assertDatabaseHas('dividas', [
            'user_id' => $user->id,
            'devedor_id' => $devedor->id,
            'descricao' => 'Pastéis da festa',
            'valor_total' => 150.00,
            'qtd_parcelas' => 1,
            'status' => 'aberta',
        ]);

        $divida = Divida::where('devedor_id', $devedor->id)->first();
        $this->assertCount(1, $divida->parcelas);
    }
}
