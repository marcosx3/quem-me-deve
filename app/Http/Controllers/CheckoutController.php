<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AbacatePayService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Inicia o fluxo de checkout para upgrade de plano (Pro ou Premium).
     */
    public function upgrade(Request $request, AbacatePayService $abacatePay)
    {
        /** @var User $user */
        $user = $request->user();

        // 2 = Pro, 3 = Premium
        $targetPlanId = (int) $request->input('plan_id', 2);
        if (!in_array($targetPlanId, [2, 3])) {
            $targetPlanId = 2;
        }

        // Se o usuário já tiver o plano desejado
        if ($user->plan_id >= $targetPlanId) {
            $nomePlano = $targetPlanId === 3 ? 'Premium' : 'Pro';
            return back()->with('success', "Você já possui o plano {$nomePlano} ou superior ativo!");
        }

        $result = $abacatePay->createCheckout($user, $targetPlanId);

        if ($result['success']) {
            return Inertia::location($result['url']);
        }

        return back()->with('error', $result['error'] ?? 'Não foi possível gerar a cobrança no momento.');
    }

    /**
     * Callback de retorno quando o usuário conclui o pagamento no AbacatePay.
     */
    public function callback(Request $request, User $user, AbacatePayService $abacatePay)
    {
        $targetPlanId = (int) $request->query('plan', 2);
        if (!in_array($targetPlanId, [2, 3])) {
            $targetPlanId = 2;
        }

        $abacatePay->activatePlan($user, $targetPlanId);
        $nomePlano = $targetPlanId === 3 ? 'Premium' : 'Pro';

        return redirect()->route('profile.edit')->with(
            'success',
            "Parabéns! Seu pagamento foi processado e seu Plano {$nomePlano} já está ativo! 🎉"
        );
    }

    /**
     * Ação de simulação rápida para ambiente local/desenvolvimento.
     */
    public function simulate(Request $request, AbacatePayService $abacatePay)
    {
        if (!app()->environment('local')) {
            abort(403);
        }

        /** @var User $user */
        $user = $request->user();

        $targetPlanId = (int) $request->input('plan_id', 2);
        if (!in_array($targetPlanId, [1, 2, 3])) {
            $targetPlanId = 2;
        }

        $abacatePay->activatePlan($user, $targetPlanId);
        $nomePlano = match ($targetPlanId) {
            3 => 'Premium',
            2 => 'Pro',
            default => 'Gratuito',
        };

        return back()->with('success', "Plano {$nomePlano} ativado com sucesso em modo de simulação/desenvolvimento!");
    }
}
