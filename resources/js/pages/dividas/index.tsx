import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem, type Divida, type DividaStatusFilter, type PaginatedData, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dívidas', href: '/dividas' }];

type Filters = { q: string | null; status: DividaStatusFilter | null };

export default function DividasIndex({ dividas, filters }: { dividas: PaginatedData<Divida>; filters: Filters }) {
    const { flash } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.q ?? '');

    const applyFilters = (overrides: Partial<{ q: string | null; status: string | null }>) => {
        router.get(
            route('dividas.index'),
            {
                q: overrides.q !== undefined ? overrides.q : filters.q,
                status: overrides.status !== undefined ? overrides.status : filters.status,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters({ q: search || null });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dívidas" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <HeadingSmall title="Dívidas" description="Dívidas registradas e suas parcelas" />
                    <Button asChild>
                        <Link href={route('dividas.create')}>
                            <Plus className="mr-1 size-4" />
                            Nova dívida
                        </Link>
                    </Button>
                </div>

                {flash.success && (
                    <Alert className="border-primary/30 bg-primary/5">
                        <CheckCircle2 className="size-4 text-primary" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por devedor ou descrição..."
                                className="pl-8"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Buscar
                        </Button>
                    </form>

                    <Select value={filters.status ?? 'todas'} onValueChange={(value) => applyFilters({ status: value === 'todas' ? null : value })}>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todos status</SelectItem>
                            <SelectItem value="aberta">Aberta</SelectItem>
                            <SelectItem value="vencida">Vencida</SelectItem>
                            <SelectItem value="quitada">Quitada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Devedor</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="hidden sm:table-cell">Valor</TableHead>
                                <TableHead className="hidden md:table-cell">Parcelas</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-0 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dividas.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                        {filters.q || filters.status ? 'Nenhuma dívida encontrada para esse filtro.' : 'Nenhuma dívida cadastrada ainda.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {dividas.data.map((divida) => (
                                <TableRow key={divida.id}>
                                    <TableCell className="font-medium">{divida.devedor.nome}</TableCell>
                                    <TableCell className="text-muted-foreground">{divida.descricao}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{formatCurrency(divida.valor_total)}</TableCell>
                                    <TableCell className="hidden text-muted-foreground md:table-cell">
                                        {divida.parcelas_pagas_count ?? 0}/{divida.qtd_parcelas}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={divida.status === 'quitada' ? 'outline' : divida.vencida ? 'destructive' : 'default'}
                                        >
                                            {divida.status === 'quitada' ? 'Quitada' : divida.vencida ? 'Vencida' : 'Aberta'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={route('dividas.edit', divida.id)} aria-label="Editar">
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>

                                            <DeleteDividaDialog divida={divida} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {dividas.meta.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {dividas.meta.links.map((link, index) =>
                            link.url ? (
                                <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" asChild>
                                    <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ) : (
                                <Button key={index} variant="outline" size="sm" disabled>
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ),
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function DeleteDividaDialog({ divida }: { divida: Divida }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('dividas.destroy', divida.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Excluir">
                    <Trash2 className="size-4 text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Excluir dívida de {divida.devedor.nome}?</DialogTitle>
                <DialogDescription>Essa ação não pode ser desfeita. Todas as parcelas dessa dívida também serão removidas.</DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
