import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import DevedorForm from '@/pages/devedores/partials/devedor-form';
import { type BreadcrumbItem, type Devedor } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function EditDevedor({ devedor }: { devedor: Devedor }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Devedores', href: '/devedores' },
        { title: devedor.nome, href: `/devedores/${devedor.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nome: devedor.nome,
        telefone: devedor.telefone ?? '',
        observacoes: devedor.observacoes ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('devedores.update', devedor.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${devedor.nome}`} />
            <div className="p-4">
                <HeadingSmall title="Editar devedor" description="Atualize as informações desse devedor" />
                <div className="mt-6">
                    <DevedorForm data={data} setData={setData} errors={errors} processing={processing} onSubmit={submit} submitLabel="Atualizar" />
                </div>
            </div>
        </AppLayout>
    );
}
