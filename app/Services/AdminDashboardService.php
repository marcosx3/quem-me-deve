<?php

namespace App\Services;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Parcela;
use App\Models\Plan;
use App\Models\SiteAccessLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminDashboardService
{
    public function getDashboardData(?string $search = null): array
    {
        $now = now();
        $startOfDay = $now->copy()->startOfDay();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sevenDaysAgo = $now->copy()->subDays(7);

        // 1. Usuários e Planos
        $totalUsuarios = User::count();
        $novosUsuarios30d = User::where('created_at', '>=', $thirtyDaysAgo)->count();

        $usuariosGratuito = User::where('plan_id', 1)->count();
        $usuariosPro = User::where('plan_id', 2)->count();
        $usuariosPremium = User::where('plan_id', 3)->count();

        // MRR calculado com base nos planos ativos (Pro = R$ 9,90, Premium = R$ 19,90)
        $mrr = ($usuariosPro * 9.90) + ($usuariosPremium * 19.90);
        $arr = $mrr * 12;

        // 2. Dívidas e Devedores Globais
        $totalDevedores = Devedor::count();
        $totalDividas = Divida::count();
        $volumeTotalDividas = (float) Divida::sum('valor_total');
        $volumeRecebido = (float) Parcela::where('status', 'paga')->sum('valor');
        $volumePendente = (float) Parcela::where('status', 'pendente')->sum('valor');

        // 3. Analytics de Acessos
        $acessosHoje = SiteAccessLog::where('created_at', '>=', $startOfDay)->count();
        $acessos7d = SiteAccessLog::where('created_at', '>=', $sevenDaysAgo)->count();
        $acessos30d = SiteAccessLog::where('created_at', '>=', $thirtyDaysAgo)->count();
        $acessosTotal = SiteAccessLog::count();
        $visitantesUnicos30d = SiteAccessLog::where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('ip_hash')
            ->count('ip_hash');

        // Top 6 páginas mais visitadas nos últimos 30 dias
        $topPaginas = SiteAccessLog::where('created_at', '>=', $thirtyDaysAgo)
            ->select('path', DB::raw('count(*) as total'))
            ->groupBy('path')
            ->orderByDesc('total')
            ->limit(6)
            ->get()
            ->map(fn ($p) => [
                'path' => $p->path,
                'total' => (int) $p->total,
            ])
            ->all();

        // Histórico de acessos dos últimos 14 dias (para gráfico/histograma)
        $acessosPorDia = [];
        for ($i = 13; $i >= 0; $i--) {
            $diaInicio = $now->copy()->subDays($i)->startOfDay();
            $diaFim = $now->copy()->subDays($i)->endOfDay();

            $totalDia = SiteAccessLog::whereBetween('created_at', [$diaInicio, $diaFim])->count();
            $unicosDia = SiteAccessLog::whereBetween('created_at', [$diaInicio, $diaFim])
                ->distinct('ip_hash')
                ->count('ip_hash');

            $acessosPorDia[] = [
                'data' => $diaInicio->format('d/m'),
                'dia_semana' => $diaInicio->translatedFormat('D'),
                'total' => $totalDia,
                'unicos' => $unicosDia,
            ];
        }

        // 4. Listagem de Usuários com busca
        $usersQuery = User::with('plan')
            ->withCount(['devedores', 'dividas'])
            ->withSum('dividas as volume_dividas', 'valor_total')
            ->orderByDesc('created_at');

        if ($search) {
            $usersQuery->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $usuarios = $usersQuery->paginate(15)->through(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->isAdmin(),
                'plan_id' => $user->plan_id,
                'plano' => [
                    'id' => $user->plan?->id ?? 1,
                    'nome' => $user->plan?->nome ?? 'Gratuito',
                    'slug' => $user->plan?->slug ?? 'gratuito',
                    'preco_centavos' => $user->plan?->preco_centavos ?? 0,
                ],
                'devedores_count' => $user->devedores_count ?? 0,
                'dividas_count' => $user->dividas_count ?? 0,
                'volume_dividas' => (float) ($user->volume_dividas ?? 0),
                'created_at' => $user->created_at?->format('d/m/Y H:i'),
                'created_at_human' => $user->created_at?->diffForHumans(),
            ];
        });

        $planosDisponiveis = Plan::orderBy('preco_centavos')->get(['id', 'nome', 'slug', 'preco_centavos'])->all();

        return [
            'kpis' => [
                'faturamento' => [
                    'mrr' => $mrr,
                    'arr' => $arr,
                    'usuarios_gratuito' => $usuariosGratuito,
                    'usuarios_pro' => $usuariosPro,
                    'usuarios_premium' => $usuariosPremium,
                ],
                'plataforma' => [
                    'total_usuarios' => $totalUsuarios,
                    'novos_usuarios_30d' => $novosUsuarios30d,
                    'total_devedores' => $totalDevedores,
                    'total_dividas' => $totalDividas,
                    'volume_total_dividas' => $volumeTotalDividas,
                    'volume_recebido' => $volumeRecebido,
                    'volume_pendente' => $volumePendente,
                ],
                'analytics' => [
                    'hoje' => $acessosHoje,
                    'ultimos_7d' => $acessos7d,
                    'ultimos_30d' => $acessos30d,
                    'total' => $acessosTotal,
                    'visitantes_unicos_30d' => $visitantesUnicos30d,
                    'top_paginas' => $topPaginas,
                    'grafico_14_dias' => $acessosPorDia,
                ],
            ],
            'usuarios' => $usuarios,
            'planos' => $planosDisponiveis,
            'filtros' => [
                'search' => $search,
            ],
        ];
    }

    public function alterarPlanoUsuario(User $user, int $novoPlanId): void
    {
        $plan = Plan::findOrFail($novoPlanId);
        $user->update(['plan_id' => $plan->id]);
    }
}
