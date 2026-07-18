import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Check, Menu, ShieldCheck, Users, Wallet } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Cadastre seus devedores',
        description: 'Guarde nome, telefone e observações de quem te deve, tudo em um só lugar.',
    },
    {
        icon: Wallet,
        title: 'Registre dívidas e parcelas',
        description: 'Lance o valor total, divida em parcelas e acompanhe o que já foi pago.',
    },
    {
        icon: Bell,
        title: 'Não perca vencimentos',
        description: 'Veja rapidamente quais parcelas estão em aberto e quais já venceram.',
    },
    {
        icon: ShieldCheck,
        title: 'Seus dados, só seus',
        description: 'Cada conta enxerga só as próprias anotações. Privado por padrão.',
    },
];

// Estrutura provisória dos planos — ajustar quando o modelo de cobrança for definido.
const plans = [
    {
        name: 'Gratuito',
        price: 'R$ 0',
        period: '',
        description: 'Para quem está começando a organizar as contas.',
        highlight: false,
        limits: ['Até 3 devedores', 'Até 6 dívidas'],
        extras: ['Controle de vencimentos'],
        cta: 'Criar conta grátis',
    },
    {
        name: 'Pro',
        price: 'R$ 14,99',
        period: '/mês',
        description: 'Para quem tem mais gente te devendo.',
        highlight: true,
        limits: ['Até 10 devedores', 'Até 20 dívidas'],
        extras: ['Controle de vencimentos', 'Suporte prioritário'],
        cta: 'Assinar Pro',
    },
    {
        name: 'Premium',
        price: 'R$ 89,90',
        period: '/mês',
        description: 'Para quem cobra em escala e não quer pensar em limite.',
        highlight: false,
        limits: ['Devedores ilimitados', 'Dívidas ilimitadas'],
        extras: ['Controle de vencimentos', 'Suporte prioritário'],
        cta: 'Assinar Premium',
    },
];

const mockDebts = [
    { name: 'Carlos Silva', amount: 'R$ 450,00', status: 'pending' as const, note: '2 parcelas em aberto' },
    { name: 'Ana Souza', amount: 'R$ 120,00', status: 'paid' as const, note: 'Quitado' },
    { name: 'Marcos Lima', amount: 'R$ 890,00', status: 'pending' as const, note: 'Vence em 3 dias' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Quem me deve — organize quem te deve dinheiro">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
                <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-5 fill-current" />
                            </span>
                            <span className="text-sm sm:text-base">Quem me deve</span>
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                            <a href="#recursos" className="transition-colors hover:text-foreground">
                                Recursos
                            </a>
                            <a href="#planos" className="transition-colors hover:text-foreground">
                                Planos
                            </a>
                        </nav>

                        <div className="hidden items-center gap-2 md:flex">
                            <AppearanceToggleDropdown />
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>Entrar</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Criar conta grátis</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-1 md:hidden">
                            <AppearanceToggleDropdown />
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="Abrir menu">
                                        <Menu className="size-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex w-3/4 flex-col gap-6 sm:max-w-xs">
                                    <SheetHeader>
                                        <SheetTitle className="text-left">Menu</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-4 text-base">
                                        <a href="#recursos" className="text-muted-foreground hover:text-foreground">
                                            Recursos
                                        </a>
                                        <a href="#planos" className="text-muted-foreground hover:text-foreground">
                                            Planos
                                        </a>
                                    </nav>
                                    <div className="mt-auto flex flex-col gap-2">
                                        {auth.user ? (
                                            <Button asChild>
                                                <Link href={route('dashboard')}>Dashboard</Link>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="outline" asChild>
                                                    <Link href={route('login')}>Entrar</Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link href={route('register')}>Criar conta grátis</Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden">
                        <div className="pointer-events-none absolute inset-0 -z-10">
                            <div className="absolute top-[-10rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
                            <div className="absolute top-24 right-[-6rem] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                        </div>

                        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-32">
                            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                                    Simples, rápido e privado
                                </Badge>
                                <h1 className="max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                                    Nunca mais esqueça <span className="text-primary">quem te deve</span>
                                </h1>
                                <p className="max-w-md text-base text-muted-foreground sm:text-lg">
                                    Anote devedores, dívidas e parcelas em um só lugar. Sem planilha, sem post-it, sem esquecer quem ainda te deve
                                    dinheiro.
                                </p>
                                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                    <Button size="lg" asChild>
                                        <Link href={auth.user ? route('dashboard') : route('register')}>
                                            {auth.user ? 'Ir para o Dashboard' : 'Começar grátis'}
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <a href="#planos">Ver planos</a>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                                <Card className="border-primary/20 shadow-xl shadow-primary/10">
                                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-base">Seus devedores</CardTitle>
                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">R$ 1.460,00</Badge>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        {mockDebts.map((debt) => (
                                            <div key={debt.name} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                        {debt.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{debt.name}</span>
                                                        <span className="text-xs text-muted-foreground">{debt.note}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-sm font-semibold">{debt.amount}</span>
                                                    <Badge variant={debt.status === 'paid' ? 'outline' : 'default'} className="text-[10px]">
                                                        {debt.status === 'paid' ? 'Pago' : 'Em aberto'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <section id="recursos" className="border-t bg-muted/30 py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Tudo que você precisa para não perder o controle
                                </h2>
                                <p className="mt-2 text-muted-foreground">Poucas telas, direto ao ponto.</p>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature) => (
                                    <Card key={feature.title} className="border-transparent bg-background shadow-sm">
                                        <CardHeader>
                                            <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <feature.icon className="size-5" />
                                            </span>
                                            <CardTitle className="text-base">{feature.title}</CardTitle>
                                            <CardDescription>{feature.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="planos" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Planos para todo tamanho de bagunça</h2>
                                <p className="mt-2 text-muted-foreground">Comece grátis e evolua quando precisar controlar mais gente.</p>
                            </div>
                            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {plans.map((plan) => (
                                    <Card
                                        key={plan.name}
                                        className={plan.highlight ? 'border-primary shadow-lg shadow-primary/15' : 'border-border'}
                                    >
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>{plan.name}</CardTitle>
                                                {plan.highlight && <Badge>Mais popular</Badge>}
                                            </div>
                                            <CardDescription>{plan.description}</CardDescription>
                                            <div className="pt-4">
                                                <span className="text-4xl font-bold">{plan.price}</span>
                                                <span className="text-muted-foreground">{plan.period}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-3">
                                            {plan.limits.map((limit) => (
                                                <div key={limit} className="flex items-center gap-2 text-sm font-medium">
                                                    <Check className="size-4 shrink-0 text-primary" />
                                                    {limit}
                                                </div>
                                            ))}
                                            {plan.extras.map((extra) => (
                                                <div key={extra} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Check className="size-4 shrink-0 text-primary" />
                                                    {extra}
                                                </div>
                                            ))}
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} asChild>
                                                <Link href={route('register')}>{plan.cta}</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            <p className="mt-6 text-center text-xs text-muted-foreground">Valores de exemplo, sujeitos a ajustes.</p>
                        </div>
                    </section>

                    <section className="border-t bg-primary py-16 text-primary-foreground sm:py-20">
                        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pronto para nunca mais perder o controle?</h2>
                            <p className="max-w-lg text-primary-foreground/80">
                                Crie sua conta grátis agora e organize quem te deve em menos de dois minutos.
                            </p>
                            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90" asChild>
                                <Link href={auth.user ? route('dashboard') : route('register')}>
                                    {auth.user ? 'Ir para o Dashboard' : 'Começar grátis'}
                                </Link>
                            </Button>
                        </div>
                    </section>
                </main>

                <footer className="border-t py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
                        <span>© {new Date().getFullYear()} Quem me deve</span>
                        <span>Feito para quem tá cansado de esquecer quem deve o quê.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
