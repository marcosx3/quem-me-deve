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
        // Responde a pings / checagens de integridade
        if ($request->isMethod('get')) {
            return response()->json([
                'status' => 'healthy',
                'service' => 'abacatepay-webhook',
                'timestamp' => now()->toIso8601String(),
            ]);
        }

        $payload = $request->all();
        Log::info('AbacatePay Webhook recebido', [
            'event' => $payload['event'] ?? null,
            'id' => $payload['id'] ?? null,
            'data' => $payload['data'] ?? null,
        ]);

        // Verificação opcional de secret se configurado
        $expectedSecret = config('services.abacatepay.webhook_secret');
        if (! empty($expectedSecret)) {
            $receivedSecret = $request->query('webhookSecret')
                ?? $request->header('X-Webhook-Secret')
                ?? $request->input('secret');

            if ($receivedSecret && ! hash_equals($expectedSecret, (string) $receivedSecret)) {
                Log::warning('AbacatePay Webhook rejeitado: secret inválido', [
                    'received' => $receivedSecret,
                ]);

                return response()->json(['error' => 'Unauthorized'], 401);
            }
        }

        // Identifica o externalId (ex: "user_1_plan_2" ou "user_1_plan_3")
        $externalId = $payload['data']['externalId']
            ?? $payload['data']['bill']['externalId']
            ?? $payload['data']['checkout']['externalId']
            ?? $payload['externalId']
            ?? null;

        $user = null;
        $planId = 2; // Default Pro

        if ($externalId && preg_match('/^user_(\d+)(?:_plan_(\d+))?$/', $externalId, $matches)) {
            $userId = (int) $matches[1];
            $planId = isset($matches[2]) ? (int) $matches[2] : 2;
            $user = User::find($userId);
        }

        // Fallback: se não achar por externalId, busca pelo email do cliente no payload
        if (! $user) {
            $customerEmail = $payload['data']['customer']['email']
                ?? $payload['customer']['email']
                ?? null;

            if ($customerEmail) {
                $user = User::whereRaw('LOWER(email) = ?', [strtolower(trim($customerEmail))])->first();
            }

            // Identifica o plano pelo preço ou ID do produto
            $amount = (int) ($payload['data']['amount'] ?? 0);
            $productId = $payload['data']['products'][0]['id'] ?? $payload['data']['products'][0]['externalId'] ?? null;
            if ($amount >= 8000 || $productId === 'plan_premium' || $productId === config('services.abacatepay.product_premium_id')) {
                $planId = 3;
            }
        }

        if ($user) {
            $abacatePay->activatePlan($user, $planId);
            $nomePlano = $planId === 3 ? 'Premium' : 'Pro';
            Log::info("Plano {$nomePlano} ativado via Webhook para o usuário #{$user->id} ({$user->email})");

            return response()->json([
                'success' => true,
                'message' => "Plano {$nomePlano} ativado com sucesso para o usuário #{$user->id}.",
            ]);
        }

        Log::warning('AbacatePay Webhook: usuário não localizado', ['externalId' => $externalId]);

        return response()->json([
            'success' => false,
            'message' => 'Usuário ou ID externo não identificado.',
        ], 400);
    }
}
