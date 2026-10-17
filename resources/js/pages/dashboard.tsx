import CobrancaWhatsappDialog from '@/components/cobranca-whatsapp-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type DashboardResumo, type ParcelaResumo } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CalendarClock, HandCoins, Plus, Sparkles, Users, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ devedoresCount, dividasCount, plano, totais, proximasParcelas, parcelasVencidas }: DashboardResumo) {
    const devedoresNoLimite = plano.limiteDevedores !== null && devedoresCount >= plano.limiteDevedores;
    const dividasNoLimite = plano.limiteDividas !== null && dividasCount >= plano.limiteDividas;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Visão geral</h1>
                        <p className="text-muted-foreground">O que está em aberto e o que vence em breve.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('devedores.create')}>
                                <Plus className="mr-1 size-4" />
                                Devedor
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('dividas.create')}>
                                <Plus className="mr-1 size-4" />
                                Dívida
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">A receber</CardTitle>
                            <Wallet className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totais.a_receber)}</p>
                            <p className="text-muted-foreground text-xs">Soma das parcelas pendentes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Recebido</CardTitle>
                            <HandCoins className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totais.recebido)}</p>
                            <p className="text-muted-foreground text-xs">Soma das parcelas já pagas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Uso do plano {plano.nome ?? '—'}</CardTitle>
                            <Users className="text-primary size-4" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                            <div className="flex items-baseline justify-between">
                                <span className="text-muted-foreground text-xs">Devedores</span>
                                <span className={`text-sm font-semibold ${devedoresNoLimite ? 'text-destructive' : ''}`}>
                                    {devedoresCount}
                                    {plano.limiteDevedores !== null ? `/${plano.limiteDevedores}` : ' (sem limite)'}
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-muted-foreground text-xs">Dívidas</span>
                                <span className={`text-sm font-semibold ${dividasNoLimite ? 'text-destructive' : ''}`}>
                                    {dividasCount}
                                    {plano.limiteDividas !== null ? `/${plano.limiteDividas}` : ' (sem limite)'}
                                </span>
                            </div>
                            {(devedoresNoLimite || dividasNoLimite) && <p className="text-destructive pt-1 text-xs">Limite do plano atingido</p>}
                            {plano.limiteDevedores !== null && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary/5 mt-2 w-full gap-1.5 text-xs font-semibold"
                                    asChild
                                >
                                    <Link href="/settings/profile#plano">
                                        <Sparkles className="text-primary size-3.5" />
                                        Fazer Upgrade (Pro)
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={totais.vencidas_count > 0 ? 'border-destructive/50' : ''}>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Vencidas</CardTitle>
                            <AlertTriangle className={`size-4 ${totais.vencidas_count > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${totais.vencidas_count > 0 ? 'text-destructive' : ''}`}>{totais.vencidas_count}</p>
                            <p className="text-muted-foreground text-xs">Parcelas com vencimento no passado</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="text-destructive size-4" />
                                Parcelas vencidas
                            </CardTitle>
                            <CardDescription>Já passaram do vencimento e continuam pendentes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ParcelasList parcelas={parcelasVencidas} vazio="Nenhuma parcela vencida. 🎉" destaque />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarClock className="text-primary size-4" />
                                Próximos vencimentos
                            </CardTitle>
                            <CardDescription>As parcelas pendentes mais próximas de vencer.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ParcelasList parcelas={proximasParcelas} vazio="Nenhuma parcela pendente por aqui." />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function ParcelasList({ parcelas, vazio, destaque = false }: { parcelas: ParcelaResumo[]; vazio: string; destaque?: boolean }) {
    if (parcelas.length === 0) {
        return <p className="text-muted-foreground py-6 text-center text-sm">{vazio}</p>;
    }

    return (
        <div className="flex flex-col divide-y">
            {parcelas.map((parcela) => (
                <div key={parcela.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link
                        href={route('dividas.edit', parcela.divida_id)}
                        className="flex min-w-0 flex-1 items-center justify-between gap-3 hover:opacity-80"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{parcela.devedor_nome}</p>
                            <p className="text-muted-foreground truncate text-xs">
                                {parcela.descricao} · parcela {parcela.numero}
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-0.5">
                            <span
                                className={
                                    destaque && parcela.valor_atualizado && parcela.valor_atualizado > Number(parcela.valor)
                                        ? 'text-muted-foreground text-xs line-through'
                                        : 'text-sm font-semibold'
                                }
                            >
                                {formatCurrency(parcela.valor)}
                            </span>
                            {destaque && parcela.valor_atualizado && parcela.valor_atualizado > Number(parcela.valor) && (
                                <span className="text-destructive text-sm font-semibold">{formatCurrency(parcela.valor_atualizado)}</span>
                            )}
                            <Badge variant={destaque ? 'destructive' : 'outline'} className="text-[10px]">
                                {formatDate(parcela.vencimento)}
                            </Badge>
                        </div>
                    </Link>

                    <div className="shrink-0">
                        <CobrancaWhatsappDialog
                            parcela={{
                                id: parcela.id,
                                numero: parcela.numero,
                                valor: parcela.valor,
                                vencimento: parcela.vencimento,
                                vencida: destaque,
                                dias_atraso: parcela.dias_atraso,
                                multa_valor: parcela.multa_valor,
                                juros_valor: parcela.juros_valor,
                                valor_atualizado: parcela.valor_atualizado,
                            }}
                            devedor={{
                                nome: parcela.devedor_nome,
                                telefone: parcela.devedor_telefone,
                            }}
                            descricaoDivida={parcela.descricao}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
