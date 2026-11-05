import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Activity, ArrowUpRight, Check, Crown, DollarSign, Layers, Receipt, Search, UserCheck, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Administração', href: '/admin' }];

interface AdminUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    plan_id: number;
    plano: {
        id: number;
        nome: string;
        slug: string;
        preco_centavos: number;
    };
    devedores_count: number;
    dividas_count: number;
    volume_dividas: number;
    created_at: string;
    created_at_human: string;
}

interface PlanOption {
    id: number;
    nome: string;
    slug: string;
    preco_centavos: number;
}

interface AdminDashboardProps {
    kpis: {
        faturamento: {
            mrr: number;
            arr: number;
            usuarios_gratuito: number;
            usuarios_pro: number;
            usuarios_premium: number;
        };
        plataforma: {
            total_usuarios: number;
            novos_usuarios_30d: number;
            total_devedores: number;
            total_dividas: number;
            volume_total_dividas: number;
            volume_recebido: number;
            volume_pendente: number;
        };
    };
    usuarios: PaginatedData<AdminUser>;
    planos: PlanOption[];
    filtros: {
        search?: string | null;
    };
}

export default function AdminDashboard({ kpis, usuarios, planos, filtros }: AdminDashboardProps) {
    const [searchTerm, setSearchTerm] = useState(filtros.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('admin.dashboard'), { search: searchTerm || undefined }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel do Proprietário - Super Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Cabeçalho */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Painel do Proprietário</h1>
                            <Badge variant="default" className="gap-1 bg-amber-500 font-medium text-white hover:bg-amber-600">
                                <Crown className="size-3" />
                                Super Admin
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">Visão panorâmica do faturamento, saúde da base e gestão de usuários.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 px-2.5 py-1 text-xs">
                            <Activity className="size-3 animate-pulse text-emerald-500" />
                            <span>Sistema Ativo</span>
                        </Badge>
                    </div>
                </div>

                {/* Bloco 1: KPIs Financeiros e Faturamento */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="from-background border-emerald-500/30 bg-gradient-to-br to-emerald-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Faturamento Mensal (MRR)</CardTitle>
                            <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(kpis.faturamento.mrr)}
                                <span className="text-muted-foreground text-xs font-normal">/mês</span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-xs">
                                ARR projetado: <strong className="text-foreground">{formatCurrency(kpis.faturamento.arr)}/ano</strong>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Usuários Cadastrados</CardTitle>
                            <Users className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis.plataforma.total_usuarios}</div>
                            <p className="text-muted-foreground mt-1 text-xs">
                                <span className="font-medium text-emerald-600">+{kpis.plataforma.novos_usuarios_30d}</span> nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Divisão por Planos</CardTitle>
                            <Layers className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    Gratuito: {kpis.faturamento.usuarios_gratuito}
                                </Badge>
                                <Badge variant="outline" className="border-sky-500/40 text-xs text-sky-600 dark:text-sky-400">
                                    Pro: {kpis.faturamento.usuarios_pro}
                                </Badge>
                                <Badge className="to-primary bg-gradient-to-r from-violet-600 text-xs text-white">
                                    Premium: {kpis.faturamento.usuarios_premium}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">
                                {kpis.faturamento.usuarios_pro + kpis.faturamento.usuarios_premium} assinantes pagantes ativos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Volume de Dívidas</CardTitle>
                            <Receipt className="text-primary size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(kpis.plataforma.volume_total_dividas)}</div>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {kpis.plataforma.total_dividas} dívidas de {kpis.plataforma.total_devedores} devedores
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bloco 2: Tabela de Usuários Cadastrados */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <UserCheck className="text-primary size-4" />
                                    Usuários Cadastrados & Planos
                                </CardTitle>
                                <CardDescription>Gerencie todos os clientes da plataforma e conceda upgrades manuais.</CardDescription>
                            </div>

                            {/* Barra de Busca */}
                            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
                                    <Input
                                        type="search"
                                        placeholder="Buscar por nome ou e-mail..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-9 pl-8 text-xs"
                                    />
                                </div>
                                <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs">
                                    Filtrar
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuário</TableHead>
                                        <TableHead>Plano Atual</TableHead>
                                        <TableHead className="text-center">Devedores</TableHead>
                                        <TableHead className="text-center">Dívidas</TableHead>
                                        <TableHead>Volume (R$)</TableHead>
                                        <TableHead>Cadastro</TableHead>
                                        <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usuarios.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-muted-foreground py-6 text-center text-sm">
                                                Nenhum usuário encontrado com os filtros atuais.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        usuarios.data.map((usuario) => (
                                            <TableRow key={usuario.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-foreground text-sm font-semibold">{usuario.name}</span>
                                                            {usuario.is_admin && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="h-4 border-amber-500/40 py-0 text-[10px] text-amber-600 dark:text-amber-400"
                                                                >
                                                                    Admin
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-muted-foreground text-xs">{usuario.email}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            usuario.plano.slug === 'premium'
                                                                ? 'default'
                                                                : usuario.plano.slug === 'pro'
                                                                  ? 'outline'
                                                                  : 'secondary'
                                                        }
                                                        className={
                                                            usuario.plano.slug === 'premium'
                                                                ? 'to-primary bg-gradient-to-r from-violet-600 text-xs text-white'
                                                                : usuario.plano.slug === 'pro'
                                                                  ? 'border-sky-500/40 text-xs text-sky-600 dark:text-sky-400'
                                                                  : 'text-xs'
                                                        }
                                                    >
                                                        {usuario.plano.nome}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-center font-medium">{usuario.devedores_count}</TableCell>

                                                <TableCell className="text-center font-medium">{usuario.dividas_count}</TableCell>

                                                <TableCell className="text-sm font-medium">{formatCurrency(usuario.volume_dividas)}</TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span>{usuario.created_at}</span>
                                                        <span className="text-muted-foreground text-[11px]">{usuario.created_at_human}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <AlterarPlanoDialog usuario={usuario} planos={planos} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function AlterarPlanoDialog({ usuario, planos }: { usuario: AdminUser; planos: PlanOption[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing } = useForm({
        plan_id: usuario.plan_id,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('admin.users.plan', usuario.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                    <span>Mudar plano</span>
                    <ArrowUpRight className="size-3 opacity-60" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Alterar Plano de {usuario.name}</DialogTitle>
                    <DialogDescription>Defina o nível de acesso para o cliente ({usuario.email}).</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        {planos.map((plano) => {
                            const isSelected = data.plan_id === plano.id;
                            return (
                                <label
                                    key={plano.id}
                                    onClick={() => setData('plan_id', plano.id)}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                                        isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted/40'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-semibold">{plano.nome}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {plano.preco_centavos > 0 ? `${formatCurrency(plano.preco_centavos / 100)}/mês` : 'Gratuito'}
                                        </span>
                                    </div>
                                    {isSelected && <Check className="text-primary size-4" />}
                                </label>
                            );
                        })}
                    </div>

                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" size="sm">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" size="sm" disabled={processing || data.plan_id === usuario.plan_id}>
                            Salvar Alteração
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
