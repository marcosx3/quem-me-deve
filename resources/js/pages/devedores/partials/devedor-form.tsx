import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export interface DevedorFormData {
    nome: string;
    telefone: string;
    observacoes: string;
    [key: string]: string;
}

export default function DevedorForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
}: {
    data: DevedorFormData;
    setData: (key: keyof DevedorFormData, value: string) => void;
    errors: Partial<Record<keyof DevedorFormData, string>>;
    processing: boolean;
    onSubmit: FormEventHandler;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={data.nome} onChange={(e) => setData('nome', e.target.value)} autoFocus placeholder="Nome completo" />
                <InputError message={errors.nome} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                    id="telefone"
                    value={data.telefone}
                    onChange={(e) => setData('telefone', e.target.value)}
                    placeholder="(11) 91234-5678"
                />
                <InputError message={errors.telefone} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                    id="observacoes"
                    value={data.observacoes}
                    onChange={(e) => setData('observacoes', e.target.value)}
                    placeholder="Alguma anotação sobre esse devedor..."
                    rows={4}
                />
                <InputError message={errors.observacoes} />
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="ghost" asChild>
                    <Link href={route('devedores.index')}>Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
