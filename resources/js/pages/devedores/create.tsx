import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import DevedorForm from '@/pages/devedores/partials/devedor-form';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Devedores', href: '/devedores' },
    { title: 'Novo devedor', href: '/devedores/create' },
];

export default function CreateDevedor() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        telefone: '',
        observacoes: '',
        valor_inicial: '',
        descricao_inicial: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('devedores.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo devedor" />
            <div className="p-4">
                <HeadingSmall
                    title="Cadastrar pessoa"
                    description="Anote quem te deve dinheiro. Só o nome é necessário!"
                />
                <div className="mt-6">
                    <DevedorForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={submit}
                        submitLabel="Salvar pessoa"
                        showInitialDebt={true}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
