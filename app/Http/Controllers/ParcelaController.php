<?php

namespace App\Http\Controllers;

use App\Http\Requests\Parcela\UpdateParcelaStatusRequest;
use App\Http\Requests\Parcela\UpdateParcelaVencimentoRequest;
use App\Models\Parcela;
use App\Services\ParcelaService;
use App\Services\PixPayloadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ParcelaController extends Controller
{
    public function __construct(private readonly ParcelaService $parcelas)
    {
    }

    public function update(UpdateParcelaStatusRequest $request, Parcela $parcela): RedirectResponse
    {
        Gate::authorize('update', $parcela);

        $parcela = $request->validated('status') === 'paga'
            ? $this->parcelas->marcarPaga($parcela)
            : $this->parcelas->marcarPendente($parcela);

        return back()->with(
            'success',
            $parcela->status === 'paga' ? 'Parcela marcada como paga.' : 'Baixa da parcela desfeita.'
        );
    }

    public function updateVencimento(UpdateParcelaVencimentoRequest $request, Parcela $parcela): RedirectResponse
    {
        Gate::authorize('update', $parcela);

        $this->parcelas->atualizarVencimento($parcela, $request->validated('vencimento'));

        return back()->with('success', 'Vencimento da parcela atualizado.');
    }

    public function pix(Request $request, Parcela $parcela, PixPayloadService $pixService): JsonResponse
    {
        Gate::authorize('view', $parcela->divida);

        $user = $request->user();

        if (empty($user->chave_pix)) {
            return response()->json([
                'tem_chave' => false,
                'mensagem' => 'Chave Pix não configurada no perfil.',
            ]);
        }

        $isPremium = ($user->plan_id ?? 1) >= 3;

        $acrescimos = $parcela->calcularAcrescimos();
        $comAcrescimos = $request->boolean('com_acrescimos', false);
        $valorCobrado = ($comAcrescimos && $acrescimos['valor_atualizado'] > (float) $parcela->valor)
            ? (float) $acrescimos['valor_atualizado']
            : (float) $parcela->valor;

        $copiaECola = null;
        if ($isPremium) {
            $copiaECola = $pixService->generate(
                chave: $user->chave_pix,
                tipo: $user->tipo_chave_pix,
                valor: $valorCobrado,
                nomeRecebedor: $user->nome_titular_pix ?: $user->name,
                cidadeRecebedor: $user->cidade_titular_pix ?: 'SAO PAULO',
                descricao: "Parcela {$parcela->numero}",
            );
        }

        return response()->json([
            'tem_chave' => true,
            'chave_pix' => $user->chave_pix,
            'tipo_chave_pix' => $user->tipo_chave_pix,
            'nome_titular' => $user->nome_titular_pix ?: $user->name,
            'valor_original' => (float) $parcela->valor,
            'valor' => $valorCobrado,
            'dias_atraso' => $acrescimos['dias_atraso'],
            'multa_valor' => $acrescimos['multa_valor'],
            'juros_valor' => $acrescimos['juros_valor'],
            'valor_atualizado' => $acrescimos['valor_atualizado'],
            'tem_acrescimos' => $acrescimos['valor_atualizado'] > (float) $parcela->valor,
            'copia_e_cola' => $copiaECola,
            'is_premium' => $isPremium,
        ]);
    }
}
