import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Check, CheckCircle2, Crown, QrCode, ShieldCheck, Zap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurações de perfil',
        href: '/settings/profile',
    },
];

export default function Profile() {
    const { auth, flash } = usePage<SharedData>().props;
    const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

    const planId = auth.user.plan_id ?? 1;
    const isFree = planId === 1;
    const isPro = planId === 2;
    const isPremium = planId >= 3;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        tipo_chave_pix: (auth.user.tipo_chave_pix as string) || 'cpf',
        chave_pix: (auth.user.chave_pix as string) || '',
        nome_titular_pix: (auth.user.nome_titular_pix as string) || '',
        cidade_titular_pix: (auth.user.cidade_titular_pix as string) || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleUpgrade = (targetPlanId: number) => {
        setLoadingPlan(targetPlanId);
        router.post(
            route('checkout.upgrade'),
            { plan_id: targetPlanId },
            {
                onFinish: () => setLoadingPlan(null),
            },
        );
    };

    const handleSimulate = (targetPlanId: number) => {
        setLoadingPlan(targetPlanId);
        router.post(
            route('checkout.simulate'),
            { plan_id: targetPlanId },
            {
                onFinish: () => setLoadingPlan(null),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configurações de perfil" />

            <SettingsLayout>
                <div className="space-y-10">
                    {/* Mensagens de Sucesso ou Erro */}
                    {flash.success && (
                        <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {flash.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Card de Plano & Assinatura (AbacatePay) */}
                    <div className="space-y-4" id="plano">
                        <HeadingSmall title="Plano e Assinatura" description="Gerencie seu plano de acesso e limites no Quem me deve" />

                        <Card
                            className={
                                isPremium
                                    ? 'border-amber-500/40 bg-amber-500/5'
                                    : isPro
                                      ? 'border-emerald-500/40 bg-emerald-500/5'
                                      : 'border-border bg-card'
                            }
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                                        Plano Atual: {isPremium ? 'Premium' : isPro ? 'Pro' : 'Gratuito'}
                                    </CardTitle>
                                    <Badge
                                        variant={isFree ? 'secondary' : 'default'}
                                        className={
                                            isPremium
                                                ? 'bg-amber-500 font-semibold text-black hover:bg-amber-500'
                                                : isPro
                                                  ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                                                  : ''
                                        }
                                    >
                                        {isPremium ? 'Premium Ilimitado 👑' : isPro ? 'Pro Ativo ✨' : 'Gratuito'}
                                    </Badge>
                                </div>
                                <CardDescription className="text-xs">
                                    {isPremium
                                        ? 'Você tem acesso ilimitado: cadastre quantos devedores e dívidas precisar sem limite.'
                                        : isPro
                                          ? 'Você possui limites ampliados para controlar até 10 devedores e 20 dívidas ativas.'
                                          : 'Você está no plano gratuito com limite de até 3 devedores e 6 dívidas ativas.'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-1">
                                {isPremium ? (
                                    <div className="bg-background/60 text-muted-foreground flex items-center gap-2.5 rounded-lg border border-amber-500/30 p-3 text-xs">
                                        <Crown className="size-4 text-amber-500" />
                                        <span>Conta com acesso total sem restrições. Muito obrigado por ser um usuário Premium!</span>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {/* Opção Pro (disponível se for Free) */}
                                        {isFree && (
                                            <div className="border-primary/30 bg-primary/5 flex flex-col justify-between rounded-xl border-2 p-4">
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-foreground text-sm font-bold">Plano Pro</span>
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            Mais popular
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground mt-1 text-xs">Até 10 devedores e 20 dívidas</p>
                                                    <div className="my-3">
                                                        <span className="text-2xl font-bold">R$ 14,99</span>
                                                        <span className="text-muted-foreground text-xs">/mês</span>
                                                    </div>
                                                    <div className="text-muted-foreground space-y-1.5 text-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            <Check className="text-primary size-3.5" /> 10 devedores cadastrados
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Check className="text-primary size-3.5" /> 20 dívidas ativas
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Check className="text-primary size-3.5" /> Suporte prioritário
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleUpgrade(2)}
                                                    disabled={loadingPlan !== null}
                                                    className="mt-4 w-full gap-1.5 text-xs font-semibold"
                                                >
                                                    <Zap className="size-3.5 fill-current" />
                                                    {loadingPlan === 2 ? 'Gerando Pix...' : 'Assinar Pro (R$ 14,99)'}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Opção Premium (disponível se for Free ou Pro) */}
                                        <div
                                            className={`flex flex-col justify-between rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-4 ${isPro ? 'max-w-md sm:col-span-2' : ''}`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-foreground flex items-center gap-1.5 text-sm font-bold">
                                                        <Crown className="size-4 text-amber-500" />
                                                        Plano Premium
                                                    </span>
                                                    <Badge className="bg-amber-500 text-[10px] text-black hover:bg-amber-500">Ilimitado</Badge>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-xs">Devedores e dívidas 100% ilimitadas</p>
                                                <div className="my-3">
                                                    <span className="text-2xl font-bold">R$ 89,90</span>
                                                    <span className="text-muted-foreground text-xs">/mês</span>
                                                </div>
                                                <div className="text-muted-foreground space-y-1.5 text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <Check className="size-3.5 text-amber-600 dark:text-amber-400" /> Devedores ilimitados
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Check className="size-3.5 text-amber-600 dark:text-amber-400" /> Dívidas e parcelas
                                                        ilimitadas
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Check className="size-3.5 text-amber-600 dark:text-amber-400" /> Suporte direto e prioritário
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleUpgrade(3)}
                                                disabled={loadingPlan !== null}
                                                className="mt-4 w-full gap-1.5 bg-amber-600 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
                                            >
                                                <Crown className="size-3.5" />
                                                {loadingPlan === 3 ? 'Gerando Pix...' : 'Assinar Premium (R$ 89,90)'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            {/* Área de Simulação para Testes Locais */}
                            <CardFooter className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="text-primary size-3.5" /> Pagamento seguro via Pix com AbacatePay
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px]">Simular dev:</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => handleSimulate(1)}
                                        disabled={loadingPlan !== null}
                                    >
                                        Gratuito
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => handleSimulate(2)}
                                        disabled={loadingPlan !== null}
                                    >
                                        Pro
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => handleSimulate(3)}
                                        disabled={loadingPlan !== null}
                                    >
                                        Premium
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Formulário de Dados Básicos */}
                    <div className="space-y-6">
                        <HeadingSmall title="Informações do perfil" description="Atualize seu nome e endereço de e-mail" />

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Nome completo"
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="E-mail"
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {/* Configuração de Chave Pix para Cobranças */}
                            <div className="bg-card space-y-4 rounded-xl border p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <QrCode className="text-primary size-5" />
                                    <div>
                                        <h3 className="text-base font-semibold">Chave Pix para Cobranças</h3>
                                        <p className="text-muted-foreground text-xs">
                                            Essa chave será incluída automaticamente nas mensagens de cobrança do WhatsApp e no código Pix
                                            Copia-e-Cola.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tipo_chave_pix">Tipo de Chave</Label>
                                        <Select value={data.tipo_chave_pix} onValueChange={(val) => setData('tipo_chave_pix', val)}>
                                            <SelectTrigger id="tipo_chave_pix">
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cpf">CPF</SelectItem>
                                                <SelectItem value="cnpj">CNPJ</SelectItem>
                                                <SelectItem value="telefone">Celular / Telefone</SelectItem>
                                                <SelectItem value="email">E-mail</SelectItem>
                                                <SelectItem value="aleatoria">Chave Aleatória (EVP)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.tipo_chave_pix} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="chave_pix">Sua Chave Pix</Label>
                                        <Input
                                            id="chave_pix"
                                            value={data.chave_pix}
                                            onChange={(e) => setData('chave_pix', e.target.value)}
                                            placeholder={
                                                data.tipo_chave_pix === 'cpf'
                                                    ? '000.000.000-00'
                                                    : data.tipo_chave_pix === 'cnpj'
                                                      ? '00.000.000/0000-00'
                                                      : data.tipo_chave_pix === 'telefone'
                                                        ? '(11) 98765-4321'
                                                        : data.tipo_chave_pix === 'email'
                                                          ? 'seu-pix@exemplo.com'
                                                          : 'Chave aleatória gerada pelo seu banco'
                                            }
                                        />
                                        <InputError message={errors.chave_pix} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 border-t pt-3 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nome_titular_pix" className="text-muted-foreground text-xs">
                                            Nome do Titular da Conta (opcional)
                                        </Label>
                                        <Input
                                            id="nome_titular_pix"
                                            value={data.nome_titular_pix}
                                            onChange={(e) => setData('nome_titular_pix', e.target.value)}
                                            placeholder="Se vazio, usará seu nome cadastrado"
                                            className="text-xs"
                                        />
                                        <InputError message={errors.nome_titular_pix} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cidade_titular_pix" className="text-muted-foreground text-xs">
                                            Cidade do Titular da Conta (opcional)
                                        </Label>
                                        <Input
                                            id="cidade_titular_pix"
                                            value={data.cidade_titular_pix}
                                            onChange={(e) => setData('cidade_titular_pix', e.target.value)}
                                            placeholder="Padrão: SAO PAULO"
                                            className="text-xs"
                                        />
                                        <InputError message={errors.cidade_titular_pix} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Salvar</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Salvo</p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
