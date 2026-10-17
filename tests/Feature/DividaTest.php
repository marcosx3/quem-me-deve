<?php

namespace Tests\Feature;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Parcela;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DividaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanSeeder::class);
    }

    public function test_user_can_create_divida_with_minimal_fields_and_defaults(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);
        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'Carlos Amigo',
            'slug' => 'carlos-amigo',
        ]);

        $response = $this->actingAs($user)->post(route('dividas.store'), [
            'devedor_id' => $devedor->id,
            'valor_total' => '80.00',
        ]);

        $response->assertRedirect(route('dividas.index'));

        $this->assertDatabaseHas('dividas', [
            'user_id' => $user->id,
            'devedor_id' => $devedor->id,
            'descricao' => 'Empréstimo',
            'valor_total' => 80.00,
            'qtd_parcelas' => 1,
            'status' => 'aberta',
        ]);

        $divida = Divida::where('devedor_id', $devedor->id)->first();
        $this->assertCount(1, $divida->parcelas);
    }

    public function test_user_can_create_divida_and_inline_new_devedor_on_the_fly(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);

        $response = $this->actingAs($user)->post(route('dividas.store'), [
            'novo_devedor_nome' => 'Primo Lucas',
            'novo_devedor_telefone' => '11999998888',
            'valor_total' => '250.00',
            'qtd_parcelas' => 2,
        ]);

        $response->assertRedirect(route('dividas.index'));

        $devedor = Devedor::where('user_id', $user->id)->where('nome', 'Primo Lucas')->first();
        $this->assertNotNull($devedor);
        $this->assertSame('11999998888', $devedor->telefone);

        $divida = Divida::where('devedor_id', $devedor->id)->first();
        $this->assertNotNull($divida);
        $this->assertEquals(250.00, (float) $divida->valor_total);
        $this->assertEquals(2, $divida->qtd_parcelas);
        $this->assertSame('Empréstimo', $divida->descricao);
        $this->assertCount(2, $divida->parcelas);
    }

    public function test_divida_creation_fails_without_devedor_or_novo_devedor(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);

        $response = $this->actingAs($user)->post(route('dividas.store'), [
            'valor_total' => '100.00',
        ]);

        $response->assertSessionHasErrors(['devedor_id', 'novo_devedor_nome']);
    }

    public function test_premium_user_can_set_multa_and_juros_percentual(): void
    {
        $user = User::factory()->create(['plan_id' => 3]);
        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'Carlos Amigo',
            'slug' => 'carlos-amigo',
        ]);

        $response = $this->actingAs($user)->post(route('dividas.store'), [
            'devedor_id' => $devedor->id,
            'valor_total' => '200.00',
            'multa_percentual' => 2.0,
            'juros_mensal_percentual' => 1.5,
        ]);

        $response->assertRedirect(route('dividas.index'));

        $this->assertDatabaseHas('dividas', [
            'user_id' => $user->id,
            'multa_percentual' => 2.0,
            'juros_mensal_percentual' => 1.5,
        ]);
    }

    public function test_free_or_pro_user_cannot_set_multa_or_juros(): void
    {
        $user = User::factory()->create(['plan_id' => 1]);
        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'Carlos Amigo',
            'slug' => 'carlos-amigo',
        ]);

        $response = $this->actingAs($user)->post(route('dividas.store'), [
            'devedor_id' => $devedor->id,
            'valor_total' => '200.00',
            'multa_percentual' => 2.0,
            'juros_mensal_percentual' => 1.5,
        ]);

        $response->assertRedirect(route('dividas.index'));

        $this->assertDatabaseHas('dividas', [
            'user_id' => $user->id,
            'multa_percentual' => null,
            'juros_mensal_percentual' => null,
        ]);
    }

    public function test_parcela_calculates_penalty_and_interest_when_overdue(): void
    {
        $user = User::factory()->create([
            'plan_id' => 3,
            'chave_pix' => 'teste@pix.com',
            'tipo_chave_pix' => 'email',
        ]);
        $devedor = Devedor::forceCreate([
            'user_id' => $user->id,
            'nome' => 'Carlos Amigo',
            'slug' => 'carlos-amigo',
        ]);

        $divida = Divida::forceCreate([
            'user_id' => $user->id,
            'devedor_id' => $devedor->id,
            'descricao' => 'Empréstimo',
            'valor_total' => 100.00,
            'qtd_parcelas' => 1,
            'data_primeira_parcela' => now()->subDays(10)->toDateString(),
            'multa_percentual' => 2.0,
            'juros_mensal_percentual' => 3.0,
            'status' => 'aberta',
        ]);

        $parcela = Parcela::forceCreate([
            'divida_id' => $divida->id,
            'numero' => 1,
            'valor' => 100.00,
            'vencimento' => now()->subDays(10)->toDateString(),
            'status' => 'pendente',
        ]);

        $acrescimos = $parcela->calcularAcrescimos();

        $this->assertSame(10, $acrescimos['dias_atraso']);
        $this->assertEquals(2.00, $acrescimos['multa_valor']);
        $this->assertEquals(1.00, $acrescimos['juros_valor']);
        $this->assertEquals(103.00, $acrescimos['valor_atualizado']);

        // Test pix endpoint with and without com_acrescimos
        $respSem = $this->actingAs($user)->getJson(route('parcelas.pix', $parcela->id));
        $respSem->assertOk()->assertJson([
            'valor' => 100.00,
            'valor_atualizado' => 103.00,
            'tem_acrescimos' => true,
        ]);

        $respCom = $this->actingAs($user)->getJson(route('parcelas.pix', ['parcela' => $parcela->id, 'com_acrescimos' => 1]));
        $respCom->assertOk()->assertJson([
            'valor' => 103.00,
            'valor_atualizado' => 103.00,
        ]);
    }
}
