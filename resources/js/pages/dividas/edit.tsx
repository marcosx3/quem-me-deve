import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type DevedorOption, type Divida, type DividaStatus } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function EditDivida({ divida, devedores }: { divida: Divida; devedores: DevedorOption[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dívidas', href: '/dividas' },
        { title: divida.descricao, href: `/dividas/${divida.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        devedor_id: String(divida.devedor_id),
        descricao: divida.descricao,
        status: divida.status as DividaStatus,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('dividas.update', divida.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${divida.descricao}`} />
            <div className="p-4">
                <HeadingSmall title="Editar dívida" description="Valor, parcelas e vencimento não podem ser alterados depois de criados" />

                <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Valor total</p>
                        <p className="font-medium">{formatCurrency(divida.valor_total)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Parcelas</p>
                        <p className="font-medium">
                            {divida.parcelas_pagas_count ?? 0}/{divida.qtd_parcelas} pagas
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-muted-foreground">1ª parcela venceu em</p>
                        <p className="font-medium">{formatDate(divida.data_primeira_parcela)}</p>
                    </div>
                </div>

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
                        <Input id="descricao" value={data.descricao} onChange={(e) => setData('descricao', e.target.value)} />
                        <InputError message={errors.descricao} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value as DividaStatus)}>
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aberta">Aberta</SelectItem>
                                <SelectItem value="quitada">Quitada</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Atualizar
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('dividas.index')}>Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
