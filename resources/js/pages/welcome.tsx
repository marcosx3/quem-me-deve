import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    HeartHandshake,
    Menu,
    MessageCircle,
    Receipt,
    Smartphone,
    Sparkles,
    Users,
    Wallet,
    X,
} from 'lucide-react';

const realScenarios = [
    {
        icon: HeartHandshake,
        title: 'Empréstimos entre amigos e família',
        description:
            'Aquele "me salva até o quinto dia útil" ou o valor do churrasco. Acabe com o esquecimento sem criar climão.',
        tag: 'Social',
    },
    {
        icon: Receipt,
        title: 'Vendas de desapegos e usados',
        description:
            'Vendeu uma bike, móvel ou videogame parcelado pro conhecido? Acompanhe cada parcela sem se perder em papeizinhos.',
        tag: 'Boca a boca',
    },
    {
        icon: Wallet,
        title: 'Freelas, bicos e serviços autônomos',
        description:
            'Para quem presta serviços, faz consultoria ou pequenos reparos e precisa saber quem já pagou a entrada e quem falta quitar.',
        tag: 'Autônomo',
    },
    {
        icon: Users,
        title: 'Divisão de rolês e viagens',
        description:
            'Você passou o cartão na pousada ou comprou os ingressos da turma? Centralize quem já mandou o Pix e quem ainda tá devendo.',
        tag: 'Grupos',
    },
];

const steps = [
    {
        step: '01',
        title: 'Anote em 15 segundos',
        description: 'Cadastre o nome da pessoa, quanto ela te deve e o dia combinado. Se for parcelado, o app divide as parcelas pra você.',
    },
    {
        step: '02',
        title: 'Bata o olho e saiba a real',
        description: 'Veja na hora quanto dinheiro seu tá espalhado por aí, quem está com pagamento próximo e quem já atrasou.',
    },
    {
        step: '03',
        title: 'Caiu o Pix? Deu baixa com 1 clique',
        description: 'O amigo mandou o comprovante? Toque no botão de quitar parcela e pronto. Sem fórmulas de Excel e sem estresse.',
    },
];

const plans = [
    {
        name: 'Gratuito',
        price: 'R$ 0',
        period: '',
        description: 'Perfeito para quem só quer parar de esquecer as dívidas do dia a dia.',
        highlight: false,
        badge: null,
        limits: ['Até 3 devedores cadastrados', 'Até 6 dívidas ativas'],
        extras: ['Controle de parcelas e vencimentos', 'Acesso pelo celular e computador', 'Total privacidade dos seus registros'],
        cta: 'Começar grátis agora',
    },
    {
        name: 'Pro',
        price: 'R$ 14,99',
        period: '/mês',
        description: 'Para quem faz freelas, vende desapegos com frequência ou empresta bastante.',
        highlight: true,
        badge: 'Mais indicado',
        limits: ['Até 10 devedores cadastrados', 'Até 20 dívidas ativas'],
        extras: ['Controle de parcelas e vencimentos', 'Suporte prioritário', 'Sem anúncios ou distrações'],
        cta: 'Assinar Plano Pro',
    },
    {
        name: 'Premium',
        price: 'R$ 89,90',
        period: '/mês',
        description: 'Para quem tem alto volume de recebíveis e precisa de liberdade total.',
        highlight: false,
        badge: null,
        limits: ['Devedores ilimitados', 'Dívidas e parcelas ilimitadas'],
        extras: ['Tudo do plano Pro', 'Suporte direto no WhatsApp', 'Histórico completo sem limites'],
        cta: 'Assinar Premium',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Quem me deve — organize quem te deve sem estresse">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
                {/* Cabeçalho */}
                <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-5" />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-base font-bold leading-none tracking-tight">Quem me deve</span>
                                <span className="text-[10px] text-muted-foreground font-normal">Controle de empréstimos</span>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
                            <a href="#cenarios" className="transition-colors hover:text-foreground">
                                Para quem é?
                            </a>
                            <a href="#como-funciona" className="transition-colors hover:text-foreground">
                                Como funciona
                            </a>
                            <a href="#comparativo" className="transition-colors hover:text-foreground">
                                Por que não Excel?
                            </a>
                            <a href="#planos" className="transition-colors hover:text-foreground">
                                Planos
                            </a>
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            <AppearanceToggleDropdown />
                            {auth.user ? (
                                <Button asChild className="gap-2">
                                    <Link href={route('dashboard')}>
                                        Abrir Dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>Entrar</Link>
                                    </Button>
                                    <Button asChild className="gap-2">
                                        <Link href={route('register')}>
                                            Começar grátis
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:hidden">
                            <AppearanceToggleDropdown />
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                                        <Menu className="size-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex w-4/5 flex-col gap-6 sm:max-w-xs">
                                    <SheetHeader>
                                        <SheetTitle className="text-left flex items-center gap-2">
                                            <span className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground">
                                                <AppLogoIcon className="size-4" />
                                            </span>
                                            Quem me deve
                                        </SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-4 text-base">
                                        <a href="#cenarios" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Para quem é?
                                        </a>
                                        <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Como funciona
                                        </a>
                                        <a href="#comparativo" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Por que não Excel?
                                        </a>
                                        <a href="#planos" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Planos
                                        </a>
                                    </nav>
                                    <div className="mt-auto flex flex-col gap-2 pt-6 border-t">
                                        {auth.user ? (
                                            <Button asChild className="w-full">
                                                <Link href={route('dashboard')}>Ir para o Dashboard</Link>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="outline" asChild className="w-full">
                                                    <Link href={route('login')}>Entrar na conta</Link>
                                                </Button>
                                                <Button asChild className="w-full">
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
                    {/* Hero Section */}
                    <section className="relative border-b py-16 sm:py-24 lg:py-28">
                        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8">
                            <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
                                    <Sparkles className="size-3.5" />
                                    <span>Controle simples, sem vergonha de cobrar</span>
                                </div>

                                <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.15]">
                                    Nunca mais esqueça <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-4">quem te deve</span> aquele Pix.
                                </h1>

                                <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg leading-relaxed">
                                    Emprestou dinheiro pro amigo, vendeu um desapego parcelado ou fez um freela? Chega de perder comprovante ou
                                    esquecer quem ainda te deve. Anote tudo em 15 segundos.
                                </p>

                                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                    <Button size="lg" asChild className="gap-2 text-base px-6 shadow-sm">
                                        <Link href={auth.user ? route('dashboard') : route('register')}>
                                            {auth.user ? 'Acessar meu Dashboard' : 'Começar grátis agora'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="text-base px-6">
                                        <a href="#como-funciona">Ver como funciona</a>
                                    </Button>
                                </div>

                                <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground lg:justify-start">
                                    <span className="flex items-center gap-1.5">
                                        <Check className="size-3.5 text-primary" /> Grátis para começar
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Check className="size-3.5 text-primary" /> Sem cartão de crédito
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Check className="size-3.5 text-primary" /> Feito para usar no celular
                                    </span>
                                </div>
                            </div>

                            {/* Hero Realistic Mockup Card */}
                            <div className="relative mx-auto w-full max-w-md lg:col-span-5">
                                <div className="rounded-2xl border bg-card p-4 shadow-xl sm:p-5">
                                    {/* Mock Header: Totais */}
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">A receber na rua</p>
                                            <p className="text-2xl font-bold tracking-tight text-foreground">R$ 875,00</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" /> R$ 350 pagos
                                            </span>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">3 devedores ativos</p>
                                        </div>
                                    </div>

                                    {/* Mock Cards: Situações Cotidianas */}
                                    <div className="mt-4 flex flex-col gap-3">
                                        {/* Devedor 1: Vence hoje */}
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-semibold text-amber-700 dark:text-amber-300 text-xs">
                                                    LM
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Lucas Mendes</p>
                                                    <p className="truncate text-xs text-muted-foreground">Churrasco da turma · Parcela 2/3</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold">R$ 75,00</p>
                                                <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                                                    Vence hoje
                                                </span>
                                            </div>
                                        </div>

                                        {/* Devedor 2: Vencido */}
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/20 font-semibold text-destructive text-xs">
                                                    CR
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Camila Rocha</p>
                                                    <p className="truncate text-xs text-muted-foreground">Venda do celular antigo</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold">R$ 450,00</p>
                                                <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-destructive/15 text-destructive">
                                                    Venceu há 3 dias
                                                </span>
                                            </div>
                                        </div>

                                        {/* Devedor 3: Já pago */}
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 opacity-90">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                                                    RA
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Rodrigo Alves</p>
                                                    <p className="truncate text-xs text-muted-foreground">Freela de design · Parcela 1/2</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold line-through text-muted-foreground">R$ 350,00</p>
                                                <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                                                    Quitado via Pix 🎉
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footnote */}
                                    <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <MessageCircle className="size-3.5 text-primary" />
                                            <span>Sem clima pesado</span>
                                        </span>
                                        <span className="font-medium text-foreground">1 toque para quitar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cenários Reais do Dia a Dia */}
                    <section id="cenarios" className="py-16 sm:py-24 border-b bg-muted/20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Para qualquer momento em que a grana saiu da sua conta
                                </h2>
                                <p className="mt-3 text-base text-muted-foreground">
                                    Não importa se foram R$ 20 do almoço ou R$ 1.500 de um trabalho: ter clareza evita que você arque com a conta
                                    sozinho.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {realScenarios.map((item) => (
                                    <Card key={item.title} className="flex flex-col justify-between border bg-background shadow-xs">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <item.icon className="size-5" />
                                                </span>
                                                <Badge variant="secondary" className="text-[11px] font-normal">
                                                    {item.tag}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base font-semibold leading-snug">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Por que não Excel / Bloco de notas? (Reality Check) */}
                    <section id="comparativo" className="py-16 sm:py-24 border-b">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    "Mas eu já anoto no bloco de notas ou numa planilha..."
                                </h2>
                                <p className="mt-3 text-base text-muted-foreground">
                                    Será que funciona mesmo? Veja a diferença entre tentar improvisar e ter uma ferramenta feita só pra isso:
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {/* Bloco de notas */}
                                <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs">
                                    <div>
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
                                            <Smartphone className="size-5" />
                                        </div>
                                        <h3 className="text-lg font-bold">Bloco de Notas do celular</h3>
                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                            Você digita "Carlos deve 100", mas não tem data de vencimento, não calcula parcelas e logo se perde no
                                            meio de senhas e listas de compras.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 pt-4 border-t text-xs font-semibold text-destructive">
                                        <X className="size-4" /> Vira um cemitério de notas esquecidas
                                    </div>
                                </div>

                                {/* Planilha Excel */}
                                <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-xs">
                                    <div>
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
                                            <Calendar className="size-5" />
                                        </div>
                                        <h3 className="text-lg font-bold">Planilha no Excel / Sheets</h3>
                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                            Fazer fórmulas no computador é bonito, mas ninguém tem saco de abrir planilha cheia de colunas na tela
                                            pequena do celular na rua.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 pt-4 border-t text-xs font-semibold text-destructive">
                                        <X className="size-4" /> Fica desatualizada em poucos dias
                                    </div>
                                </div>

                                {/* Quem me deve */}
                                <div className="flex flex-col justify-between rounded-xl border-2 border-primary bg-primary/5 p-6 shadow-sm">
                                    <div>
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                                            <Sparkles className="size-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-foreground">Quem me deve</h3>
                                            <Badge className="text-[10px]">Sob medida</Badge>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                            Leva 15 segundos: você cadastra o devedor, define o vencimento das parcelas e dá baixa com 1 toque quando
                                            o Pix cair. Leve, rápido e sem frescura.
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 pt-4 border-t border-primary/20 text-xs font-semibold text-primary">
                                        <CheckCircle2 className="size-4" /> Controle total sem esforço
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Como funciona em 3 passos */}
                    <section id="como-funciona" className="py-16 sm:py-24 border-b bg-muted/20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Como funciona na prática</h2>
                                <p className="mt-3 text-base text-muted-foreground">Tudo foi desenhado para você resolver em menos de 1 minuto.</p>
                            </div>

                            <div className="mt-12 grid gap-8 md:grid-cols-3">
                                {steps.map((item) => (
                                    <div key={item.step} className="relative flex flex-col rounded-xl border bg-background p-6 shadow-xs">
                                        <span className="text-3xl font-black text-primary/40 font-mono mb-3">{item.step}</span>
                                        <h3 className="text-lg font-bold">{item.title}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Planos */}
                    <section id="planos" className="py-16 sm:py-24 border-b">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Planos claros, sem letras miúdas</h2>
                                <p className="mt-3 text-base text-muted-foreground">
                                    Comece 100% grátis e só passe para um plano maior se o volume de devedores aumentar.
                                </p>
                            </div>

                            <div className="mt-12 mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                                {plans.map((plan) => (
                                    <Card
                                        key={plan.name}
                                        className={`flex flex-col justify-between ${
                                            plan.highlight
                                                ? 'border-2 border-primary shadow-lg shadow-primary/10 relative'
                                                : 'border bg-background'
                                        }`}
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                                                {plan.badge && <Badge className="text-xs">{plan.badge}</Badge>}
                                            </div>
                                            <CardDescription className="min-h-10 text-xs mt-1.5 leading-relaxed">
                                                {plan.description}
                                            </CardDescription>
                                            <div className="pt-4">
                                                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                                                <span className="text-sm text-muted-foreground">{plan.period}</span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex flex-col gap-2.5 py-4 border-t border-b">
                                            {plan.limits.map((limit) => (
                                                <div key={limit} className="flex items-center gap-2 text-xs font-semibold">
                                                    <Check className="size-4 shrink-0 text-primary" />
                                                    <span>{limit}</span>
                                                </div>
                                            ))}
                                            {plan.extras.map((extra) => (
                                                <div key={extra} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Check className="size-4 shrink-0 text-primary/70" />
                                                    <span>{extra}</span>
                                                </div>
                                            ))}
                                        </CardContent>

                                        <CardFooter className="pt-4">
                                            <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'} asChild>
                                                <Link href={route('register')}>{plan.cta}</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            <p className="mt-8 text-center text-xs text-muted-foreground">
                                Cancele quando quiser. Sem fidelidade ou taxas escondidas.
                            </p>
                        </div>
                    </section>

                    {/* Chamada Final Humanizada */}
                    <section className="py-16 sm:py-24">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6">
                            <div className="rounded-2xl border bg-muted/40 p-8 sm:p-12 text-center shadow-xs">
                                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                                    <Clock className="size-6" />
                                </span>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Chega de perder dinheiro por pura distração
                                </h2>
                                <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    Crie sua conta em menos de 1 minuto, anote quem te deve e tenha a tranquilidade de saber que sua grana está
                                    organizada.
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Button size="lg" asChild className="gap-2 px-8">
                                        <Link href={auth.user ? route('dashboard') : route('register')}>
                                            {auth.user ? 'Ir para o Dashboard' : 'Criar minha conta grátis'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Rodapé */}
                <footer className="border-t py-8 bg-background">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
                        <div className="flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-3" />
                            </span>
                            <span className="font-semibold text-foreground">Quem me deve</span>
                            <span>— © {new Date().getFullYear()}</span>
                        </div>
                        <span>Feito para quem preza pela paz de espírito e quer o próprio dinheiro de volta.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
