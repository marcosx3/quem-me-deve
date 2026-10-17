import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem, type DevedorOption, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Check, ChevronDown, ChevronUp, DollarSign, FileText, Percent, Plus, Sparkles, User, UserPlus, Users } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dívidas', href: '/dividas' },
    { title: 'Nova dívida', href: '/dividas/create' },
];

function getPresetDate(type: '30d' | '15d' | 'end_of_month'): string {
    const today = new Date();
    if (type === '15d') {
        const d = new Date(today);
        d.setDate(d.getDate() + 15);
        return d.toISOString().split('T')[0];
    }
    if (type === 'end_of_month') {
        const d = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return d.toISOString().split('T')[0];
    }
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
}

function formatDateShort(isoDate: string): string {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}`;
}

const AMOUNT_PRESETS = [20, 50, 100, 200, 500];
const INSTALLMENT_PRESETS = [1, 2, 3, 4, 6, 12];

export default function CreateDivida({
    devedores,
    devedorSelecionadoId,
}: {
    devedores: DevedorOption[];
    devedorSelecionadoId: number | null;
}) {
    // Se o usuário não tiver devedores ou se quiser adicionar na hora, começa em 'new'
    const hasDevedores = devedores.length > 0;
    const [debtorMode, setDebtorMode] = useState<'existing' | 'new'>(
        hasDevedores ? 'existing' : 'new'
    );

    const defaultDate = useMemo(() => getPresetDate('30d'), []);
    const date15d = useMemo(() => getPresetDate('15d'), []);
    const dateEndOfMonth = useMemo(() => getPresetDate('end_of_month'), []);

    const [dateOption, setDateOption] = useState<'30d' | '15d' | 'end_of_month' | 'custom'>('30d');
    const [installmentOption, setInstallmentOption] = useState<number | 'custom'>(1);
    const { auth } = usePage<SharedData>().props;
    const isPremium = (auth.user.plan_id ?? 1) >= 3;
    const [showJuros, setShowJuros] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        devedor_id: devedorSelecionadoId ? String(devedorSelecionadoId) : (hasDevedores ? String(devedores[0]?.id || '') : ''),
        novo_devedor_nome: '',
        novo_devedor_telefone: '',
        descricao: '',
        valor_total: '',
        qtd_parcelas: '1',
        data_primeira_parcela: defaultDate,
        multa_percentual: '',
        juros_mensal_percentual: '',
    });

    const handleDatePreset = (type: '30d' | '15d' | 'end_of_month') => {
        setDateOption(type);
        setData('data_primeira_parcela', getPresetDate(type));
    };

    const handleInstallmentPreset = (count: number) => {
        setInstallmentOption(count);
        setData('qtd_parcelas', String(count));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        // Limpa devedor_id se estiver cadastrando novo, ou novo_devedor se escolheu existente
        if (debtorMode === 'new') {
            setData((prev) => ({ ...prev, devedor_id: '' }));
        } else {
            setData((prev) => ({ ...prev, novo_devedor_nome: '', novo_devedor_telefone: '' }));
        }

        post(route('dividas.store'));
    };

    const parsedAmount = parseFloat(data.valor_total.replace(',', '.'));
    const parsedInstallments = parseInt(data.qtd_parcelas, 10) || 1;
    const installmentValue = !isNaN(parsedAmount) && parsedInstallments > 0 ? parsedAmount / parsedInstallments : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anotar dívida" />
            <div className="p-4">
                <HeadingSmall
                    title="Anotar uma dívida"
                    description="Registre rapidamente quem te deve e quanto. Sem burocracia."
                />

                <form onSubmit={submit} className="mt-6 max-w-xl space-y-6">
                    {/* Seção 1: Quem te deve? */}
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-primary" />
                                    <Label className="text-base font-semibold">Quem te deve?</Label>
                                </div>

                                {hasDevedores && (
                                    <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setDebtorMode('existing')}
                                            className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all ${
                                                debtorMode === 'existing'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <Users className="size-3" />
                                            Já cadastrado
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDebtorMode('new')}
                                            className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all ${
                                                debtorMode === 'new'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <UserPlus className="size-3" />
                                            Novo nome
                                        </button>
                                    </div>
                                )}
                            </div>

                            {debtorMode === 'existing' && hasDevedores ? (
                                <div className="space-y-2">
                                    <Select
                                        value={data.devedor_id}
                                        onValueChange={(val) => setData('devedor_id', val)}
                                    >
                                        <SelectTrigger id="devedor_id" className="text-base">
                                            <SelectValue placeholder="Selecione quem te deve" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {devedores.map((devedor) => (
                                                <SelectItem key={devedor.id} value={String(devedor.id)}>
                                                    {devedor.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.devedor_id} />
                                    <p className="text-xs text-muted-foreground">
                                        Quer anotar para outra pessoa?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setDebtorMode('new')}
                                            className="font-medium text-primary underline underline-offset-2"
                                        >
                                            Digitar um novo nome
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!hasDevedores && (
                                        <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
                                            Basta digitar o nome da pessoa abaixo. Salvaremos o contato automaticamente para você!
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="novo_devedor_nome" className="text-sm font-medium">
                                            Nome ou apelido da pessoa
                                        </Label>
                                        <Input
                                            id="novo_devedor_nome"
                                            value={data.novo_devedor_nome}
                                            onChange={(e) => setData('novo_devedor_nome', e.target.value)}
                                            placeholder="Ex: Seu Jorge, Carlinhos, Tia Bete..."
                                            autoFocus
                                            className="text-base"
                                        />
                                        <InputError message={errors.novo_devedor_nome} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="novo_devedor_telefone" className="text-sm font-medium text-muted-foreground">
                                            WhatsApp ou telefone (opcional)
                                        </Label>
                                        <Input
                                            id="novo_devedor_telefone"
                                            value={data.novo_devedor_telefone}
                                            onChange={(e) => setData('novo_devedor_telefone', e.target.value)}
                                            placeholder="(11) 98765-4321 - para cobrar depois"
                                        />
                                        <InputError message={errors.novo_devedor_telefone} />
                                    </div>

                                    {hasDevedores && (
                                        <p className="text-xs text-muted-foreground">
                                            Ou prefere{' '}
                                            <button
                                                type="button"
                                                onClick={() => setDebtorMode('existing')}
                                                className="font-medium text-primary underline underline-offset-2"
                                            >
                                                escolher alguém da lista existente
                                            </button>
                                            ?
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Seção 2: Valor que te deve */}
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center gap-2">
                                <DollarSign className="size-4 text-primary" />
                                <Label htmlFor="valor_total" className="text-base font-semibold">
                                    Quanto te deve?
                                </Label>
                            </div>

                            <div className="relative">
                                <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                                    R$
                                </span>
                                <Input
                                    id="valor_total"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.valor_total}
                                    onChange={(e) => setData('valor_total', e.target.value)}
                                    placeholder="0,00"
                                    className="h-12 pl-11 text-xl font-bold tracking-tight"
                                />
                            </div>
                            <InputError message={errors.valor_total} />

                            {/* Chips de valores rápidos */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs text-muted-foreground">Valores rápidos:</span>
                                {AMOUNT_PRESETS.map((val) => (
                                    <Button
                                        key={val}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-xs font-medium"
                                        onClick={() => setData('valor_total', String(val))}
                                    >
                                        R$ {val}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seção 3: Do que se trata? (Opcional) */}
                    <Card className="shadow-sm">
                        <CardContent className="space-y-3 pt-6">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-primary" />
                                <Label htmlFor="descricao" className="text-base font-semibold">
                                    Do que se trata? <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                                </Label>
                            </div>
                            <Input
                                id="descricao"
                                value={data.descricao}
                                onChange={(e) => setData('descricao', e.target.value)}
                                placeholder="Ex: Empréstimo, almoço de domingo, conserto..."
                            />
                            <p className="text-xs text-muted-foreground">
                                Se deixar em branco, salvaremos como &quot;Empréstimo&quot;.
                            </p>
                            <InputError message={errors.descricao} />
                        </CardContent>
                    </Card>

                    {/* Seção 4: Como vai pagar? (Parcelas) */}
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Como vai pagar?</Label>
                                {installmentValue && parsedInstallments > 1 && (
                                    <Badge variant="secondary" className="font-semibold text-primary">
                                        {parsedInstallments}x de {formatCurrency(installmentValue)}/mês
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {INSTALLMENT_PRESETS.map((count) => (
                                    <Button
                                        key={count}
                                        type="button"
                                        variant={installmentOption === count ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleInstallmentPreset(count)}
                                        className="h-8 px-3 text-xs"
                                    >
                                        {count === 1 ? 'À vista (1x)' : `${count}x`}
                                    </Button>
                                ))}
                                <Button
                                    type="button"
                                    variant={installmentOption === 'custom' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setInstallmentOption('custom')}
                                    className="h-8 px-3 text-xs"
                                >
                                    Outro...
                                </Button>
                            </div>

                            {installmentOption === 'custom' && (
                                <div className="max-w-[200px] pt-1">
                                    <Label htmlFor="qtd_parcelas" className="text-xs text-muted-foreground">
                                        Número de parcelas
                                    </Label>
                                    <Input
                                        id="qtd_parcelas"
                                        type="number"
                                        min="1"
                                        max="360"
                                        value={data.qtd_parcelas}
                                        onChange={(e) => setData('qtd_parcelas', e.target.value)}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.qtd_parcelas} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Seção 5: Quando deve pagar? (Vencimento) */}
                    <Card className="shadow-sm">
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-primary" />
                                <Label className="text-base font-semibold">Quando deve pagar?</Label>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant={dateOption === '30d' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleDatePreset('30d')}
                                    className="h-8 px-3 text-xs"
                                >
                                    Em 30 dias ({formatDateShort(defaultDate)})
                                </Button>
                                <Button
                                    type="button"
                                    variant={dateOption === '15d' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleDatePreset('15d')}
                                    className="h-8 px-3 text-xs"
                                >
                                    Em 15 dias ({formatDateShort(date15d)})
                                </Button>
                                <Button
                                    type="button"
                                    variant={dateOption === 'end_of_month' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleDatePreset('end_of_month')}
                                    className="h-8 px-3 text-xs"
                                >
                                    Fim do mês ({formatDateShort(dateEndOfMonth)})
                                </Button>
                                <Button
                                    type="button"
                                    variant={dateOption === 'custom' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setDateOption('custom')}
                                    className="h-8 px-3 text-xs"
                                >
                                    Outra data...
                                </Button>
                            </div>

                            {dateOption === 'custom' && (
                                <div className="max-w-[220px] pt-1">
                                    <Label htmlFor="data_primeira_parcela" className="text-xs text-muted-foreground">
                                        Data do vencimento
                                    </Label>
                                    <Input
                                        id="data_primeira_parcela"
                                        type="date"
                                        value={data.data_primeira_parcela}
                                        onChange={(e) => setData('data_primeira_parcela', e.target.value)}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.data_primeira_parcela} />
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {parsedInstallments > 1
                                    ? 'As parcelas seguintes vencerão mensalmente a partir dessa data.'
                                    : 'Data sugerida para você cobrar ou acompanhar o pagamento.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Seção 6: Juros e Multa por Atraso (Opcional - Premium) */}
                    <Card className="shadow-sm">
                        <CardContent className="pt-6">
                            <button
                                type="button"
                                onClick={() => setShowJuros(!showJuros)}
                                className="flex w-full items-center justify-between text-left text-sm font-semibold hover:text-primary transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Percent className="size-4 text-primary" />
                                    <span>Cobrar juros ou multa se houver atraso? (Opcional)</span>
                                </div>
                                {showJuros ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                            </button>

                            {showJuros && (
                                <div className="mt-4 space-y-4 border-t pt-4">
                                    {isPremium ? (
                                        <>
                                            <p className="text-xs text-muted-foreground">
                                                Configure os percentuais desejados. Se uma parcela atrasar, o sistema calculará o valor atualizado automaticamente a cada dia.
                                            </p>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="multa_percentual" className="text-xs font-medium">
                                                        Multa por atraso (%)
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="multa_percentual"
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            value={data.multa_percentual}
                                                            onChange={(e) => setData('multa_percentual', e.target.value)}
                                                            placeholder="Ex: 2.00 (2%)"
                                                            className="pr-8"
                                                        />
                                                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                                                            %
                                                        </span>
                                                    </div>
                                                    <InputError message={errors.multa_percentual} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="juros_mensal_percentual" className="text-xs font-medium">
                                                        Juros ao mês (% a.m.)
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="juros_mensal_percentual"
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            value={data.juros_mensal_percentual}
                                                            onChange={(e) => setData('juros_mensal_percentual', e.target.value)}
                                                            placeholder="Ex: 1.00 (1%/mês)"
                                                            className="pr-8"
                                                        />
                                                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                                                            %
                                                        </span>
                                                    </div>
                                                    <InputError message={errors.juros_mensal_percentual} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3 text-xs">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-primary flex items-center gap-1.5">
                                                    <Sparkles className="size-3.5" />
                                                    Recurso exclusivo do plano Premium
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Faça upgrade para calcular juros e multas automáticos em atrasos.
                                                </p>
                                            </div>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href="/settings/profile#plano">Upgrade</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing} size="lg" className="px-8 font-semibold">
                            <Check className="mr-2 size-5" />
                            Salvar dívida
                        </Button>
                        <Button type="button" variant="ghost" size="lg" asChild>
                            <Link href={route('dividas.index')}>Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
