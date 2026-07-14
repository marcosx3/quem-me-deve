import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type DevedorOption } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dívidas', href: '/dividas' },
    { title: 'Nova dívida', href: '/dividas/create' },
];

export default function CreateDivida({
    devedores,
    devedorSelecionadoId,
}: {
    devedores: DevedorOption[];
    devedorSelecionadoId: number | null;
}) {
    const { data, setData, post, processing, errors } = useForm({
        devedor_id: devedorSelecionadoId ? String(devedorSelecionadoId) : '',
        descricao: '',
        valor_total: '',
        qtd_parcelas: '1',
        data_primeira_parcela: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('dividas.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova dívida" />
            <div className="p-4">
                <HeadingSmall title="Nova dívida" description="Registre uma dívida e as parcelas serão geradas automaticamente" />

                {devedores.length === 0 ? (
                    <div className="mt-6 max-w-xl rounded-lg border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Você precisa cadastrar um devedor antes de registrar uma dívida.
                        </p>
                        <Button className="mt-4" asChild>
                            <Link href={route('devedores.create')}>Cadastrar devedor</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="mt-6 max-w-xl space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="devedor_id">Devedor</Label>
                            <Select value={data.devedor_id} onValueChange={(value) => setData('devedor_id', value)}>
                                <SelectTrigger id="devedor_id">
                                    <SelectValue placeholder="Selecione o devedor" />
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
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input
                                id="descricao"
                                value={data.descricao}
                                onChange={(e) => setData('descricao', e.target.value)}
                                placeholder="Ex: Empréstimo para conserto do carro"
                                autoFocus
                            />
                            <InputError message={errors.descricao} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="valor_total">Valor total (R$)</Label>
                                <Input
                                    id="valor_total"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.valor_total}
                                    onChange={(e) => setData('valor_total', e.target.value)}
                                    placeholder="0,00"
                                />
                                <InputError message={errors.valor_total} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="qtd_parcelas">Nº de parcelas</Label>
                                <Input
                                    id="qtd_parcelas"
                                    type="number"
                                    step="1"
                                    min="1"
                                    max="360"
                                    value={data.qtd_parcelas}
                                    onChange={(e) => setData('qtd_parcelas', e.target.value)}
                                />
                                <InputError message={errors.qtd_parcelas} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="data_primeira_parcela">Vencimento da 1ª parcela</Label>
                            <Input
                                id="data_primeira_parcela"
                                type="date"
                                value={data.data_primeira_parcela}
                                onChange={(e) => setData('data_primeira_parcela', e.target.value)}
                            />
                            <InputError message={errors.data_primeira_parcela} />
                            <p className="text-xs text-muted-foreground">
                                As demais parcelas vencem mensalmente a partir dessa data e não podem ser alteradas depois.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                Salvar
                            </Button>
                            <Button type="button" variant="ghost" asChild>
                                <Link href={route('dividas.index')}>Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
