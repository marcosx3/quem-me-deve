<?php

namespace App\Services;

use App\Models\Devedor;
use App\Models\Divida;
use App\Models\Parcela;
use App\Models\User;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RelatorioService
{
    public function getDadosRelatorio(User $user): array
    {
        $userId = $user->id;
        $hoje = now()->toDateString();

        // Totais Gerais
        $totalEmprestado = (float) Divida::where('user_id', $userId)->sum('valor_total');

        $baseParcelas = Parcela::whereHas('divida', fn ($q) => $q->where('user_id', $userId));

        $totalRecebido = (float) (clone $baseParcelas)->where('status', 'paga')->sum('valor');
        $totalPendente = (float) (clone $baseParcelas)->where('status', 'pendente')->where('vencimento', '>=', $hoje)->sum('valor');
        $totalVencido = (float) (clone $baseParcelas)->where('status', 'pendente')->where('vencimento', '<', $hoje)->sum('valor');
        $totalAReceberGeral = $totalPendente + $totalVencido;

        $qtdPagas = (clone $baseParcelas)->where('status', 'paga')->count();
        $qtdPendentes = (clone $baseParcelas)->where('status', 'pendente')->where('vencimento', '>=', $hoje)->count();
        $qtdVencidas = (clone $baseParcelas)->where('status', 'pendente')->where('vencimento', '<', $hoje)->count();
        $qtdTotalParcelas = $qtdPagas + $qtdPendentes + $qtdVencidas;

        $taxaRecuperacao = $totalEmprestado > 0 ? round(($totalRecebido / $totalEmprestado) * 100, 1) : 0;

        // Previsão nos próximos 30, 60, 90 dias
        $d30 = now()->addDays(30)->toDateString();
        $d60 = now()->addDays(60)->toDateString();
        $d90 = now()->addDays(90)->toDateString();

        $prev30d = (float) (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d30])->sum('valor');
        $count30d = (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d30])->count();

        $prev60d = (float) (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d60])->sum('valor');
        $count60d = (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d60])->count();

        $prev90d = (float) (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d90])->sum('valor');
        $count90d = (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$hoje, $d90])->count();

        // Fluxo Mensal (próximos 6 meses)
        $fluxoMensal = [];
        $mesesPt = [
            1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr', 5 => 'Mai', 6 => 'Jun',
            7 => 'Jul', 8 => 'Ago', 9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez',
        ];

        for ($i = 0; $i < 6; $i++) {
            $mesRef = now()->addMonths($i);
            $inicioMes = $mesRef->copy()->startOfMonth()->toDateString();
            $fimMes = $mesRef->copy()->endOfMonth()->toDateString();

            // Para o mês corrente, considera a partir de hoje
            if ($i === 0) {
                $inicioMes = $hoje;
            }

            $valorMes = (float) (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$inicioMes, $fimMes])->sum('valor');
            $countMes = (clone $baseParcelas)->where('status', 'pendente')->whereBetween('vencimento', [$inicioMes, $fimMes])->count();

            $fluxoMensal[] = [
                'mes' => $mesesPt[(int) $mesRef->format('n')].'/'.$mesRef->format('y'),
                'chave' => $mesRef->format('Y-m'),
                'valor' => $valorMes,
                'parcelas_count' => $countMes,
            ];
        }

        // Top 5 Devedores (com maior saldo pendente)
        $devedores = Devedor::where('user_id', $userId)
            ->with(['dividas.parcelas'])
            ->get()
            ->map(function (Devedor $dev) use ($hoje) {
                $parcelas = $dev->dividas->flatMap->parcelas;
                $totalDevido = (float) $dev->dividas->sum('valor_total');
                $totalPago = (float) $parcelas->where('status', 'paga')->sum('valor');
                $totalPendente = (float) $parcelas->where('status', 'pendente')->sum('valor');
                $temAtraso = $parcelas->contains(fn ($p) => $p->status === 'pendente' && $p->vencimento->toDateString() < $hoje);

                return [
                    'id' => $dev->id,
                    'nome' => $dev->nome,
                    'telefone' => $dev->telefone,
                    'total_devido' => $totalDevido,
                    'total_pago' => $totalPago,
                    'total_pendente' => $totalPendente,
                    'tem_atraso' => $temAtraso,
                    'dividas_count' => $dev->dividas->count(),
                ];
            })
            ->sortByDesc('total_pendente')
            ->values()
            ->take(5)
            ->all();

        return [
            'totais' => [
                'total_emprestado' => $totalEmprestado,
                'total_recebido' => $totalRecebido,
                'total_pendente' => $totalPendente,
                'total_vencido' => $totalVencido,
                'total_a_receber_geral' => $totalAReceberGeral,
                'taxa_recuperacao' => $taxaRecuperacao,
                'qtd_pagas' => $qtdPagas,
                'qtd_pendentes' => $qtdPendentes,
                'qtd_vencidas' => $qtdVencidas,
                'qtd_total_parcelas' => $qtdTotalParcelas,
            ],
            'previsao' => [
                'dias_30' => ['valor' => $prev30d, 'count' => $count30d],
                'dias_60' => ['valor' => $prev60d, 'count' => $count60d],
                'dias_90' => ['valor' => $prev90d, 'count' => $count90d],
                'fluxo_mensal' => $fluxoMensal,
            ],
            'top_devedores' => $devedores,
        ];
    }

    public function exportCsv(User $user): StreamedResponse
    {
        $userId = $user->id;
        $hoje = now()->toDateString();

        $parcelas = Parcela::whereHas('divida', fn ($q) => $q->where('user_id', $userId))
            ->with(['divida:id,devedor_id,descricao,qtd_parcelas', 'divida.devedor:id,nome,telefone'])
            ->orderBy('vencimento')
            ->get();

        $filename = 'relatorio-quem-me-deve-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($parcelas, $hoje) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM para compatibilidade com Microsoft Excel
            fputs($handle, "\xEF\xBB\xBF");

            // Cabeçalho com separador ';'
            fputcsv($handle, [
                'Devedor',
                'Telefone',
                'Descrição da Dívida',
                'Parcela',
                'Valor (R$)',
                'Vencimento',
                'Status',
                'Data do Pagamento',
                'Dias em Atraso',
            ], ';');

            foreach ($parcelas as $p) {
                $statusFormatado = $p->status === 'paga' ? 'Paga' : ($p->vencimento->toDateString() < $hoje ? 'Vencida' : 'Pendente');
                $diasAtraso = 0;
                if ($p->status === 'pendente' && $p->vencimento->toDateString() < $hoje) {
                    $diasAtraso = (int) now()->diffInDays($p->vencimento);
                }

                fputcsv($handle, [
                    $p->divida->devedor->nome,
                    $p->divida->devedor->telefone ?? '-',
                    $p->divida->descricao,
                    "{$p->numero}/{$p->divida->qtd_parcelas}",
                    number_format((float) $p->valor, 2, ',', '.'),
                    $p->vencimento->format('d/m/Y'),
                    $statusFormatado,
                    $p->pago_em ? Carbon::parse($p->pago_em)->format('d/m/Y') : '-',
                    $diasAtraso,
                ], ';');
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
