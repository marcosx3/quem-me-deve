import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Devedor, type PaginatedData, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Devedores', href: '/devedores' }];

export default function DevedoresIndex({ devedores, filters }: { devedores: PaginatedData<Devedor>; filters: { q: string | null } }) {
    const { flash } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.q ?? '');
    const [devedorCriado, setDevedorCriado] = useState(flash.devedorCriado ?? null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('devedores.index'), search ? { q: search } : {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devedores" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <HeadingSmall title="Devedores" description="Pessoas que te devem dinheiro" />
                    <Button asChild>
                        <Link href={route('devedores.create')}>
                            <Plus className="mr-1 size-4" />
                            Novo devedor
                        </Link>
                    </Button>
                </div>

                {flash.success && (
                    <Alert className="border-primary/30 bg-primary/5">
                        <CheckCircle2 className="size-4 text-primary" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSearch} className="flex gap-2 sm:max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome..." className="pl-8" />
                    </div>
                    <Button type="submit" variant="secondary">
                        Buscar
                    </Button>
                </form>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                                <TableHead className="hidden md:table-cell">Cadastrado em</TableHead>
                                <TableHead className="w-0 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devedores.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                        {filters.q ? 'Nenhum devedor encontrado para essa busca.' : 'Nenhum devedor cadastrado ainda.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {devedores.data.map((devedor) => (
                                <TableRow key={devedor.id}>
                                    <TableCell className="font-medium">{devedor.nome}</TableCell>
                                    <TableCell className="hidden text-muted-foreground sm:table-cell">{devedor.telefone ?? '—'}</TableCell>
                                    <TableCell className="hidden text-muted-foreground md:table-cell">
                                        {new Date(devedor.created_at).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={route('devedores.edit', devedor.id)} aria-label="Editar">
                                                <Pencil className="size-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {devedores.meta.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {devedores.meta.links.map((link, index) =>
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

            <Dialog open={devedorCriado !== null} onOpenChange={(open) => !open && setDevedorCriado(null)}>
                <DialogContent>
                    <DialogTitle>Cadastrar uma dívida para {devedorCriado?.nome}?</DialogTitle>
                    <DialogDescription>O devedor foi cadastrado com sucesso. Já quer aproveitar e registrar uma dívida para essa pessoa?</DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={() => setDevedorCriado(null)}>
                                Agora não
                            </Button>
                        </DialogClose>
                        <Button asChild>
                            <Link href={route('dividas.create', { devedor_id: devedorCriado?.id })}>Cadastrar dívida</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
