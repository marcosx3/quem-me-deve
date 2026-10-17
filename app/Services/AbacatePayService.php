<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AbacatePayService
{
    protected string $apiKey;
    protected string $proProductId;
    protected string $premiumProductId;
    protected string $baseUrl;
    protected ?string $webhookSecret;

    public function __construct()
    {
        $this->apiKey = config('services.abacatepay.api_key') ?? '';
        $this->proProductId = config('services.abacatepay.product_id') ?? 'prod_MsfgGB1LdBjnUjwneB4H3XEZ';
        $this->premiumProductId = config('services.abacatepay.product_premium_id') ?? 'prod_5PjmF6ag3Fqkfuys3BqBT2XE';
        $this->baseUrl = config('services.abacatepay.base_url') ?? 'https://api.abacatepay.com/v2';
        $this->webhookSecret = config('services.abacatepay.webhook_secret');
    }

    /**
     * Cria um checkout no AbacatePay para o usuário realizar o pagamento Pix.
     *
     * @param int $targetPlanId 2 para Pro (R$ 14,99), 3 para Premium (R$ 89,90)
     * @return array{success: bool, url?: string, id?: string, error?: string}
     */
    public function createCheckout(User $user, int $targetPlanId = 2): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'error' => 'A chave de API do AbacatePay não foi configurada.',
            ];
        }

        $productId = $targetPlanId === 3 ? $this->premiumProductId : $this->proProductId;

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(15)
                ->post("{$this->baseUrl}/checkouts/create", [
                    'items' => [
                        [
                            'id' => $productId,
                            'quantity' => 1,
                        ],
                    ],
                    'methods' => ['PIX'],
                    'returnUrl' => route('profile.edit'),
                    'completionUrl' => route('checkout.callback', ['user' => $user->id, 'plan' => $targetPlanId]),
                    'externalId' => "user_{$user->id}_plan_{$targetPlanId}",
                ]);

            if ($response->successful() && $response->json('success')) {
                return [
                    'success' => true,
                    'url' => $response->json('data.url'),
                    'id' => $response->json('data.id'),
                ];
            }

            Log::error('Erro ao criar checkout no AbacatePay', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return [
                'success' => false,
                'error' => $response->json('error') ?? 'Falha ao gerar link de pagamento no AbacatePay.',
            ];
        } catch (Exception $e) {
            Log::error('Exceção ao conectar com AbacatePay', ['message' => $e->getMessage()]);

            return [
                'success' => false,
                'error' => 'Erro de conexão com o gateway de pagamento: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Ativa um plano específico para o usuário (2 = Pro, 3 = Premium).
     */
    public function activatePlan(User $user, int $planId): bool
    {
        $validPlanId = in_array($planId, [2, 3]) ? $planId : 2;
        return $user->update(['plan_id' => $validPlanId]);
    }

    /**
     * Compatibilidade retroativa: ativa o Plano Pro (id 2).
     */
    public function activateProPlan(User $user): bool
    {
        return $this->activatePlan($user, 2);
    }
}
