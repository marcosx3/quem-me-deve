<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AbacatePayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AbacatePayWebhookController extends Controller
{
    /**
     * Recebe e processa webhooks disparados pelo AbacatePay.
     */
    public function handle(Request $request, AbacatePayService $abacatePay): JsonResponse
    {
        $payload = $request->all();
        Log::info('AbacatePay Webhook recebido', $payload);

        // Identifica o externalId (ex: "user_1_plan_2" ou "user_1_plan_3" ou "user_1")
        $externalId = $payload['data']['externalId']
            ?? $payload['data']['bill']['externalId']
            ?? $payload['externalId']
            ?? null;

        if ($externalId && preg_match('/^user_(\d+)(?:_plan_(\d+))?$/', $externalId, $matches)) {
            $userId = (int) $matches[1];
            $planId = isset($matches[2]) ? (int) $matches[2] : 2;

            $user = User::find($userId);

            if ($user) {
                $abacatePay->activatePlan($user, $planId);
                $nomePlano = $planId === 3 ? 'Premium' : 'Pro';
                Log::info("Plano {$nomePlano} ativado via Webhook para o usuário #{$user->id}");

                return response()->json(['success' => true, 'message' => "Plano {$nomePlano} ativado com sucesso."]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Usuário ou ID externo não identificado.'], 400);
    }
}
