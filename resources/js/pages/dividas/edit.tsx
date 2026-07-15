import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type DevedorOption, type Divida, type Parcela } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function EditDivida({ divida, devedores, parcelas }: { divida: Divida; devedores: DevedorOption[]; parcelas: Parcela[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dívidas', href: '/dividas' },
        { title: divida.descricao, href: `/dividas/${divida.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        devedor_id: String(divida.devedor_id),
        descricao: divida.descricao,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('dividas.update', divida.id));
    };

    const alternarStatusParcela = (parcela: Parcela) => {
        router.patch(
            route('parcelas.update', parcela.id),
            { status: parcela.status === 'paga' ? 'pendente' : 'paga' },
            { preserveScroll: true },
        );
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
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium">
                            <Badge variant={divida.status === 'quitada' ? 'outline' : 'default'}>
                                {divida.status === 'quitada' ? 'Quitada' : 'Aberta'}
                            </Badge>
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

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Atualizar
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('dividas.index')}>Cancelar</Link>
                        </Button>
                    </div>
                </form>

                <div className="mt-10 max-w-xl">
                    <HeadingSmall title="Parcelas" description="Dê baixa em cada parcela conforme for recebendo" />

                    <div className="mt-4 rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-0">Nº</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0 text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parcelas.map((parcela) => (
                                    <TableRow key={parcela.id}>
                                        <TableCell className="text-muted-foreground">{parcela.numero}</TableCell>
                                        <TableCell>{formatDate(parcela.vencimento)}</TableCell>
                                        <TableCell>{formatCurrency(parcela.valor)}</TableCell>
                                        <TableCell>
                                            <Badge variant={parcela.status === 'paga' ? 'outline' : parcela.vencida ? 'destructive' : 'default'}>
                                                {parcela.status === 'paga' ? 'Paga' : parcela.vencida ? 'Vencida' : 'Pendente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => alternarStatusParcela(parcela)}>
                                                {parcela.status === 'paga' ? 'Desfazer baixa' : 'Marcar como paga'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
