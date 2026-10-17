import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, DollarSign, Sparkles, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export interface DevedorFormData {
    nome: string;
    telefone: string;
    observacoes: string;
    valor_inicial?: string;
    descricao_inicial?: string;
    data_vencimento_inicial?: string;
    [key: string]: string | undefined;
}

export default function DevedorForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    showInitialDebt = false,
}: {
    data: DevedorFormData;
    setData: (key: keyof DevedorFormData, value: string) => void;
    errors: Partial<Record<keyof DevedorFormData, string>>;
    processing: boolean;
    onSubmit: FormEventHandler;
    submitLabel: string;
    showInitialDebt?: boolean;
}) {
    const [showMoreDetails, setShowMoreDetails] = useState(Boolean(data.telefone || data.observacoes));
    const [includeDebt, setIncludeDebt] = useState(Boolean(data.valor_inicial));

    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-6">
            {/* Campo Principal: Nome */}
            <div className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    <Label htmlFor="nome" className="text-base font-semibold">
                        Nome ou apelido da pessoa
                    </Label>
                </div>
                <Input
                    id="nome"
                    value={data.nome}
                    onChange={(e) => setData('nome', e.target.value)}
                    autoFocus
                    placeholder="Ex: Carlinhos, Tia Bete, Marcos da Oficina"
                    className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                    Apenas o nome é obrigatório. Fácil e sem burocracia.
                </p>
                <InputError message={errors.nome} />
            </div>

            {/* Opcional: Já registrar uma dívida de imediato */}
            {showInitialDebt && (
                <Card className={`border-dashed transition-colors ${includeDebt ? 'border-primary/50 bg-primary/5' : 'bg-muted/30'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="size-4 text-primary" />
                                    <h4 className="font-semibold text-sm sm:text-base">Já te deve algum valor agora?</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Se quiser, anote o valor já e economize tempo. Totalmente opcional!
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant={includeDebt ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    if (includeDebt) {
                                        setData('valor_inicial', '');
                                        setData('descricao_inicial', '');
                                        setIncludeDebt(false);
                                    } else {
                                        setIncludeDebt(true);
                                    }
                                }}
                            >
                                {includeDebt ? 'Remover valor' : '+ Anotar valor'}
                            </Button>
                        </div>

                        {includeDebt && (
                            <div className="mt-4 space-y-4 border-t pt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="valor_inicial" className="text-sm font-medium">
                                        Quanto essa pessoa te deve? (R$)
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                                            R$
                                        </span>
                                        <Input
                                            id="valor_inicial"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={data.valor_inicial ?? ''}
                                            onChange={(e) => setData('valor_inicial', e.target.value)}
                                            placeholder="0,00"
                                            className="pl-10 text-base font-semibold"
                                            autoFocus
                                        />
                                    </div>
                                    <InputError message={errors.valor_inicial} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="descricao_inicial" className="text-sm font-medium">
                                        Do que se trata? (Opcional)
                                    </Label>
                                    <Input
                                        id="descricao_inicial"
                                        value={data.descricao_inicial ?? ''}
                                        onChange={(e) => setData('descricao_inicial', e.target.value)}
                                        placeholder="Ex: Empréstimo, almoço, cerveja..."
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Se deixar em branco, salvaremos como &quot;Empréstimo&quot;.
                                    </p>
                                    <InputError message={errors.descricao_inicial} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Detalhes extras opcionais (Telefone e Observações) */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                    className="flex w-full items-center justify-between text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <span>Mais informações (telefone, anotações) - opcional</span>
                    {showMoreDetails ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>

                {showMoreDetails && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="telefone">WhatsApp / Telefone</Label>
                            <Input
                                id="telefone"
                                value={data.telefone}
                                onChange={(e) => setData('telefone', e.target.value)}
                                placeholder="(11) 98765-4321"
                            />
                            <p className="text-xs text-muted-foreground">
                                Útil para enviar mensagens de cobrança depois.
                            </p>
                            <InputError message={errors.telefone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="observacoes">Anotações ou lembretes</Label>
                            <Textarea
                                id="observacoes"
                                value={data.observacoes}
                                onChange={(e) => setData('observacoes', e.target.value)}
                                placeholder="Ex: Vizinho da rua de trás, trabalha na oficina..."
                                rows={3}
                            />
                            <InputError message={errors.observacoes} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={processing} className="px-6 font-semibold">
                    <Sparkles className="mr-2 size-4" />
                    {submitLabel}
                </Button>
                <Button type="button" variant="ghost" asChild>
                    <Link href={route('devedores.index')}>Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
