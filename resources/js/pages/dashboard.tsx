import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type DashboardResumo, type ParcelaResumo } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CalendarClock, HandCoins, Plus, Users, Wallet } from 'lucide-react';

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
                            <CardTitle className="text-sm font-medium text-muted-foreground">A receber</CardTitle>
                            <Wallet className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totais.a_receber)}</p>
                            <p className="text-xs text-muted-foreground">Soma das parcelas pendentes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Recebido</CardTitle>
                            <HandCoins className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totais.recebido)}</p>
                            <p className="text-xs text-muted-foreground">Soma das parcelas já pagas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Uso do plano {plano.nome ?? '—'}</CardTitle>
                            <Users className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs text-muted-foreground">Devedores</span>
                                <span className={`text-sm font-semibold ${devedoresNoLimite ? 'text-destructive' : ''}`}>
                                    {devedoresCount}
                                    {plano.limiteDevedores !== null ? `/${plano.limiteDevedores}` : ' (sem limite)'}
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs text-muted-foreground">Dívidas</span>
                                <span className={`text-sm font-semibold ${dividasNoLimite ? 'text-destructive' : ''}`}>
                                    {dividasCount}
                                    {plano.limiteDividas !== null ? `/${plano.limiteDividas}` : ' (sem limite)'}
                                </span>
                            </div>
                            {(devedoresNoLimite || dividasNoLimite) && (
                                <p className="pt-1 text-xs text-destructive">Limite do plano atingido</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={totais.vencidas_count > 0 ? 'border-destructive/50' : ''}>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Vencidas</CardTitle>
                            <AlertTriangle className={`size-4 ${totais.vencidas_count > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${totais.vencidas_count > 0 ? 'text-destructive' : ''}`}>{totais.vencidas_count}</p>
                            <p className="text-xs text-muted-foreground">Parcelas com vencimento no passado</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="size-4 text-destructive" />
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
                                <CalendarClock className="size-4 text-primary" />
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
        return <p className="py-6 text-center text-sm text-muted-foreground">{vazio}</p>;
    }

    return (
        <div className="flex flex-col divide-y">
            {parcelas.map((parcela) => (
                <Link
                    key={parcela.id}
                    href={route('dividas.edit', parcela.divida_id)}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
                >
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{parcela.devedor_nome}</p>
                        <p className="truncate text-xs text-muted-foreground">
                            {parcela.descricao} · parcela {parcela.numero}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-semibold">{formatCurrency(parcela.valor)}</span>
                        <Badge variant={destaque ? 'destructive' : 'outline'} className="text-[10px]">
                            {formatDate(parcela.vencimento)}
                        </Badge>
                    </div>
                </Link>
            ))}
        </div>
    );
}
