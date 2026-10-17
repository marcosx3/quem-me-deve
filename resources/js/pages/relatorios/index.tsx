import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem, type RelatorioDados, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock, Crown, FileSpreadsheet, Lock, Printer, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Relatórios', href: '/relatorios' }];

export default function RelatoriosIndex({ dados, isPremium }: { dados: RelatorioDados; isPremium: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const { totais, previsao, top_devedores } = dados;

    // Acha o maior valor mensal para escalar as barras do histograma
    const maxMesValor = useMemo(() => {
        const valores = previsao.fluxo_mensal.map((m) => m.valor);
        return Math.max(...valores, 1);
    }, [previsao.fluxo_mensal]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatórios e Previsão" />

            <div className="flex flex-1 flex-col gap-6 p-4 print:p-0">
                {/* Cabeçalho de Impressão (visível apenas ao imprimir) */}
                <div className="hidden border-b pb-4 print:block">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">Relatório Financeiro — Quem me Deve</h1>
                            <p className="text-muted-foreground text-xs">
                                Emitido por: {auth.user.name} ({auth.user.email}) em {new Date().toLocaleDateString('pt-BR')} às{' '}
                                {new Date().toLocaleTimeString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cabeçalho Normal na Tela */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <HeadingSmall
                        title="Relatórios e Previsão"
                        description="Acompanhe seu fluxo financeiro futuro, taxas de retorno e exporte seus extratos."
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                            <Printer className="size-4" />
                            <span>Imprimir / PDF</span>
                        </Button>

                        {isPremium ? (
                            <Button asChild size="sm" className="gap-1.5 bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                                <a href={route('relatorios.export.csv')}>
                                    <FileSpreadsheet className="size-4" />
                                    <span>Exportar Excel (.csv)</span>
                                </a>
                            </Button>
                        ) : (
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-primary/50 text-primary hover:bg-primary/5 gap-1.5 border-dashed"
                            >
                                <Link href="/settings/profile#plano">
                                    <Lock className="size-3.5" />
                                    <span>Exportar Excel (Premium)</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Banner de Upgrade para quem não é Premium */}
                {!isPremium && (
                    <Card className="border-primary/30 bg-primary/5 shadow-sm print:hidden">
                        <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Crown className="size-5 fill-amber-500/20 text-amber-500" />
                                    <h3 className="text-base font-semibold">Desbloqueie o potencial completo com o Premium</h3>
                                </div>
                                <p className="text-muted-foreground max-w-xl text-xs">
                                    Exporte planilhas prontas para Excel, tenha projeção estendida de 90 dias, gráficos mensais avançados e devedores
                                    ilimitados.
                                </p>
                            </div>
                            <Button asChild className="shrink-0 gap-1.5 font-semibold">
                                <Link href="/settings/profile#plano">
                                    <Sparkles className="size-4" />
                                    Fazer Upgrade
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Métricas Principais (KPIs) */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Registrado</CardTitle>
                            <Wallet className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totais.total_emprestado)}</p>
                            <p className="text-muted-foreground text-xs">{totais.qtd_total_parcelas} parcelas registradas no total</p>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-500/30 bg-emerald-500/5">
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Total Já Recebido</CardTitle>
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totais.total_recebido)}</p>
                            <div className="mt-2 space-y-1">
                                <div className="text-muted-foreground flex items-center justify-between text-xs">
                                    <span>Taxa de retorno:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{totais.taxa_recuperacao}%</span>
                                </div>
                                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                                    <div
                                        className="h-full bg-emerald-500 transition-all"
                                        style={{ width: `${Math.min(totais.taxa_recuperacao, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">A Receber (Em Dia)</CardTitle>
                            <Clock className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-primary text-2xl font-bold">{formatCurrency(totais.total_pendente)}</p>
                            <p className="text-muted-foreground text-xs">{totais.qtd_pendentes} parcelas com vencimento futuro</p>
                        </CardContent>
                    </Card>

                    <Card className={totais.total_vencido > 0 ? 'border-destructive/40 bg-destructive/5' : ''}>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Inadimplência (Vencidas)</CardTitle>
                            <AlertTriangle className={`size-4 ${totais.total_vencido > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${totais.total_vencido > 0 ? 'text-destructive' : ''}`}>
                                {formatCurrency(totais.total_vencido)}
                            </p>
                            <p className="text-muted-foreground text-xs">{totais.qtd_vencidas} parcelas aguardando cobrança</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Previsão de Recebimentos Futuros (Fluxo de Caixa) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Previsão de Recebimentos</h2>
                            <p className="text-muted-foreground text-xs">Projeção de entradas de dinheiro para os próximos meses</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                                    <span>Próximos 30 dias</span>
                                    <Badge variant="secondary" className="text-[10px]">
                                        Curto prazo
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-primary text-2xl font-bold">{formatCurrency(previsao.dias_30.valor)}</p>
                                <p className="text-muted-foreground text-xs">{previsao.dias_30.count} parcelas a receber</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                                    <span>31 a 60 dias</span>
                                    <Badge variant="outline" className="text-[10px]">
                                        Médio prazo
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatCurrency(previsao.dias_60.valor)}</p>
                                <p className="text-muted-foreground text-xs">{previsao.dias_60.count} parcelas a receber</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                                    <span>61 a 90 dias</span>
                                    <Badge variant="outline" className="text-[10px]">
                                        Longo prazo
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatCurrency(previsao.dias_90.valor)}</p>
                                <p className="text-muted-foreground text-xs">{previsao.dias_90.count} parcelas a receber</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráfico Mensal de Fluxo Futuro (Próximos 6 Meses) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="text-primary size-4" />
                                Projeção Mensal (Próximos 6 Meses)
                            </CardTitle>
                            <CardDescription>Quanto dinheiro está programado para cair mês a mês</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-6 gap-2 pt-6 pb-2 sm:gap-4">
                                {previsao.fluxo_mensal.map((m) => {
                                    const percentage = maxMesValor > 0 ? Math.round((m.valor / maxMesValor) * 100) : 0;
                                    const heightPercent = Math.max(percentage, 8);

                                    return (
                                        <div key={m.chave} className="flex flex-col items-center gap-2">
                                            {/* Valor formatado em cima */}
                                            <span className="text-foreground w-full truncate text-center text-[10px] font-semibold sm:text-xs">
                                                {m.valor > 0 ? formatCurrency(m.valor) : 'R$ 0'}
                                            </span>

                                            {/* Coluna / Barra Vertical */}
                                            <div className="bg-muted/40 flex h-36 w-full max-w-[48px] items-end justify-center rounded-lg p-1 sm:h-44">
                                                <div
                                                    className="bg-primary/80 hover:bg-primary w-full rounded-md transition-all"
                                                    style={{ height: `${heightPercent}%` }}
                                                    title={`${m.mes}: ${formatCurrency(m.valor)} (${m.parcelas_count} parcelas)`}
                                                />
                                            </div>

                                            {/* Rótulo do Mês e Quantidade */}
                                            <div className="text-center">
                                                <p className="text-foreground text-xs font-semibold">{m.mes}</p>
                                                <p className="text-muted-foreground text-[10px]">{m.parcelas_count} parc.</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabela de Maiores Devedores */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Maiores Saldos Devedores</h2>
                        <p className="text-muted-foreground text-xs">Pessoas com os maiores volumes de crédito pendente</p>
                    </div>

                    <div className="bg-card rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pessoa</TableHead>
                                    <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                                    <TableHead className="hidden md:table-cell">Total Emprestado</TableHead>
                                    <TableHead className="hidden md:table-cell">Total Já Pago</TableHead>
                                    <TableHead>Saldo Pendente</TableHead>
                                    <TableHead className="text-right">Situação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {top_devedores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center text-sm">
                                            Nenhum devedor com saldo em aberto no momento.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    top_devedores.map((dev) => (
                                        <TableRow key={dev.id}>
                                            <TableCell className="text-foreground font-semibold">
                                                <Link href={route('devedores.edit', dev.id)} className="hover:underline">
                                                    {dev.nome}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden text-xs sm:table-cell">
                                                {dev.telefone || '—'}
                                            </TableCell>
                                            <TableCell className="hidden text-xs md:table-cell">{formatCurrency(dev.total_devido)}</TableCell>
                                            <TableCell className="hidden text-xs text-emerald-600 md:table-cell dark:text-emerald-400">
                                                {formatCurrency(dev.total_pago)}
                                            </TableCell>
                                            <TableCell className="text-primary text-sm font-bold">{formatCurrency(dev.total_pendente)}</TableCell>
                                            <TableCell className="text-right">
                                                {dev.tem_atraso ? (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        Com atraso
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                                                    >
                                                        Em dia
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
