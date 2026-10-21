import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import PublicFooter from '@/components/public-footer';
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
    HelpCircle,
    Lock,
    Mail,
    Menu,
    MessageCircle,
    Receipt,
    ShieldCheck,
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
        description: 'Aquele "me salva até o quinto dia útil" ou o valor do churrasco. Acabe com o esquecimento sem criar climão.',
        tag: 'Social',
    },
    {
        icon: Receipt,
        title: 'Vendas de desapegos e usados',
        description: 'Vendeu uma bike, móvel ou videogame parcelado pro conhecido? Acompanhe cada parcela sem se perder em papeizinhos.',
        tag: 'Boca a boca',
    },
    {
        icon: Wallet,
        title: 'Freelas, bicos e serviços autônomos',
        description: 'Para quem presta serviços, faz consultoria ou pequenos reparos e precisa saber quem já pagou a entrada e quem falta quitar.',
        tag: 'Autônomo',
    },
    {
        icon: Users,
        title: 'Divisão de rolês e viagens',
        description: 'Você passou o cartão na pousada ou comprou os ingressos da turma? Centralize quem já mandou o Pix e quem ainda tá devendo.',
        tag: 'Grupos',
    },
];

const faqs = [
    {
        question: 'O aplicativo cobra meus amigos ou envia mensagens sozinho?',
        answer: 'De forma alguma! O Quem me deve é um caderno digital 100% pessoal e privado. Ninguém além de você vê o que está registrado e nenhuma mensagem é enviada sem sua revisão. Nosso gerador apenas monta o texto educado para você, se desejar, abrir e enviar pelo seu próprio WhatsApp.',
    },
    {
        question: 'Preciso cadastrar cartão de crédito para usar o plano grátis?',
        answer: 'Zero cartão de crédito. Você cria sua conta informando apenas nome e e-mail. Não solicitamos dados de pagamento e não há pegadinhas ou cobranças ocultas.',
    },
    {
        question: 'Preciso baixar na App Store ou Google Play?',
        answer: 'Não precisa baixar nada nem ocupar espaço no celular! O Quem me deve funciona diretamente pelo navegador de qualquer celular (iPhone ou Android) ou computador. Se quiser, basta tocar em "Adicionar à tela de início" para abrir como um app nativo.',
    },
    {
        question: 'Como dou baixa quando a pessoa me pagar?',
        answer: 'Basta abrir sua lista e tocar no botão "Quitar parcela" com 1 clique. O valor é abatido do total a receber instantaneamente e fica salvo no seu histórico.',
    },
    {
        question: 'Posso cobrar vendas parceladas com juros ou multa se atrasar?',
        answer: 'Sim! Você pode cadastrar cobranças parceladas em quantas vezes combinar. E nos planos Pro e Premium, pode configurar multa e juros diários automáticos para quando houver atraso.',
    },
    {
        question: 'Meus dados e anotações financeiras estão protegidos?',
        answer: 'Totalmente. Operamos em estrita conformidade com a LGPD (Lei nº 13.709/2018). Seus registros contam com proteção criptografada e nós nunca vendemos, cedemos ou compartilhamos dados com bancos ou terceiros.',
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

            <div className="bg-background text-foreground selection:bg-primary/20 selection:text-primary min-h-screen antialiased">
                {/* Cabeçalho */}
                <header className="bg-background/90 sticky top-0 z-40 border-b backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90">
                            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-sm">
                                <AppLogoIcon className="size-5" />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-base leading-none font-bold tracking-tight">Quem me deve</span>
                                <span className="text-muted-foreground text-[10px] font-normal">Controle de empréstimos</span>
                            </div>
                        </Link>

                        <nav className="text-muted-foreground hidden items-center gap-7 text-sm font-medium lg:flex">
                            <a href="#cenarios" className="hover:text-foreground transition-colors">
                                Para quem é?
                            </a>
                            <a
                                href="#whatsapp-pix"
                                className="hover:text-foreground font-semibold text-emerald-600 transition-colors dark:text-emerald-400"
                            >
                                Cobrança WhatsApp
                            </a>
                            <a href="#como-funciona" className="hover:text-foreground transition-colors">
                                Como funciona
                            </a>
                            <a href="#comparativo" className="hover:text-foreground transition-colors">
                                Por que não Excel?
                            </a>
                            <a href="#planos" className="hover:text-foreground transition-colors">
                                Planos
                            </a>
                            <a href="#faq" className="hover:text-foreground transition-colors">
                                Dúvidas
                            </a>
                            <a href="#contato" className="hover:text-foreground transition-colors">
                                Contato
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
                                        <SheetTitle className="flex items-center gap-2 text-left">
                                            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded">
                                                <AppLogoIcon className="size-4" />
                                            </span>
                                            Quem me deve
                                        </SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-4 text-base">
                                        <a href="#cenarios" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Para quem é?
                                        </a>
                                        <a
                                            href="#whatsapp-pix"
                                            className="hover:text-foreground font-semibold text-emerald-600 transition-colors dark:text-emerald-400"
                                        >
                                            Cobrança no WhatsApp
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
                                        <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Dúvidas frequentes (FAQ)
                                        </a>
                                        <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
                                            Contato
                                        </a>
                                    </nav>
                                    <div className="mt-auto flex flex-col gap-2 border-t pt-6">
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
                                <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                                    <Sparkles className="size-3.5" />
                                    <span>Controle simples, sem vergonha de cobrar</span>
                                </div>

                                <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.15]">
                                    Nunca mais esqueça{' '}
                                    <span className="text-primary decoration-primary/30 underline decoration-wavy underline-offset-4">
                                        quem te deve
                                    </span>{' '}
                                    aquele Pix.
                                </h1>

                                <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed sm:text-lg">
                                    Emprestou dinheiro pro amigo, vendeu um desapego parcelado ou fez um freela? Chega de perder comprovante ou
                                    esquecer quem ainda te deve. Anote tudo em 15 segundos.
                                </p>

                                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                    <Button size="lg" asChild className="gap-2 px-7 text-base shadow-md">
                                        <Link href={auth.user ? route('dashboard') : route('register')}>
                                            {auth.user ? 'Acessar meu Dashboard' : 'Criar minha conta grátis'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="px-6 text-base">
                                        <a href="#whatsapp-pix">Ver cobrança no WhatsApp</a>
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mt-3 text-xs font-medium">
                                    ⚡ Cadastro em 30 segundos · Sem pedir cartão · Seus registros são 100% privados
                                </p>

                                <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs lg:justify-start">
                                    <span className="flex items-center gap-1.5">
                                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Comece grátis
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Sem cartão de crédito
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Lock className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Nunca cobra seus contatos sozinho
                                    </span>
                                </div>
                            </div>

                            {/* Hero Realistic Mockup Card */}
                            <div className="relative mx-auto w-full max-w-md lg:col-span-5">
                                <div className="bg-card rounded-2xl border p-4 shadow-xl sm:p-5">
                                    {/* Mock Header: Totais */}
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">A receber na rua</p>
                                            <p className="text-foreground text-2xl font-bold tracking-tight">R$ 875,00</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" /> R$ 350 pagos
                                            </span>
                                            <p className="text-muted-foreground mt-0.5 text-[11px]">3 devedores ativos</p>
                                        </div>
                                    </div>

                                    {/* Mock Cards: Situações Cotidianas */}
                                    <div className="mt-4 flex flex-col gap-3">
                                        {/* Devedor 1: Vence hoje */}
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                                    LM
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Lucas Mendes</p>
                                                    <p className="text-muted-foreground truncate text-xs">Churrasco da turma · Parcela 2/3</p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold">R$ 75,00</p>
                                                <span className="inline-block rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                                    Vence hoje
                                                </span>
                                            </div>
                                        </div>

                                        {/* Devedor 2: Vencido */}
                                        <div className="border-destructive/30 bg-destructive/5 flex items-center justify-between gap-3 rounded-xl border p-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="bg-destructive/20 text-destructive flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                                    CR
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Camila Rocha</p>
                                                    <p className="text-muted-foreground truncate text-xs">Venda do celular antigo</p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold">R$ 450,00</p>
                                                <span className="bg-destructive/15 text-destructive inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold">
                                                    Venceu há 3 dias
                                                </span>
                                            </div>
                                        </div>

                                        {/* Devedor 3: Já pago */}
                                        <div className="border-border bg-muted/20 flex items-center justify-between gap-3 rounded-xl border p-3 opacity-90">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    RA
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">Rodrigo Alves</p>
                                                    <p className="text-muted-foreground truncate text-xs">Freela de design · Parcela 1/2</p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-muted-foreground text-sm font-bold line-through">R$ 350,00</p>
                                                <span className="inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Quitado via Pix 🎉
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footnote */}
                                    <div className="bg-muted/40 text-muted-foreground mt-4 flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <MessageCircle className="text-primary size-3.5" />
                                            <span>Sem clima pesado</span>
                                        </span>
                                        <span className="text-foreground font-medium">1 toque para quitar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cenários Reais do Dia a Dia */}
                    <section id="cenarios" className="bg-muted/20 border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Para qualquer momento em que a grana saiu da sua conta
                                </h2>
                                <p className="text-muted-foreground mt-3 text-base">
                                    Não importa se foram R$ 20 do almoço ou R$ 1.500 de um trabalho: ter clareza evita que você arque com a conta
                                    sozinho.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {realScenarios.map((item) => (
                                    <Card key={item.title} className="bg-background flex flex-col justify-between border shadow-xs">
                                        <CardHeader className="pb-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                                                    <item.icon className="size-5" />
                                                </span>
                                                <Badge variant="secondary" className="text-[11px] font-normal">
                                                    {item.tag}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base leading-snug font-semibold">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Destaque WhatsApp & Pix (Fim do Constrangimento de Cobrar) */}
                    <section id="whatsapp-pix" className="border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
                                <div className="lg:col-span-7">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <MessageCircle className="size-3.5" />
                                        <span>Fim do constrangimento de cobrar</span>
                                    </div>

                                    <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl sm:leading-tight">
                                        A pior parte de emprestar é a vergonha de cobrar.{' '}
                                        <span className="text-emerald-600 dark:text-emerald-400">Nós resolvemos isso.</span>
                                    </h2>

                                    <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                                        Chega de ficar pensando em como escrever uma mensagem sem parecer chato ou agressivo. O app gera na hora uma
                                        mensagem amigável com a sua chave Pix Copia e Cola pronta.
                                    </p>

                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                                <Check className="size-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Mensagem educada e no tom certo</p>
                                                <p className="text-muted-foreground text-xs leading-relaxed">
                                                    Texto descontraído, sem climão e sem parecer cobrança de banco. Mantém a amizade e traz seu
                                                    dinheiro de volta.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                                <Check className="size-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Pix Copia e Cola automático</p>
                                                <p className="text-muted-foreground text-xs leading-relaxed">
                                                    Elimina a desculpa do "depois me manda a chave". O devedor só copia o código no WhatsApp e cola no
                                                    app do banco em 5 segundos.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                                <ShieldCheck className="size-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Você no controle total (nada automático pelas suas costas)</p>
                                                <p className="text-muted-foreground text-xs leading-relaxed">
                                                    O sistema NUNCA envia mensagens por conta própria. Você visualiza o texto, edita se quiser e abre
                                                    no seu próprio WhatsApp pessoal.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock WhatsApp Balloon */}
                                <div className="lg:col-span-5">
                                    <div className="bg-card rounded-2xl border p-5 shadow-lg">
                                        <div className="flex items-center gap-3 border-b pb-3">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                                                LM
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">Lucas Mendes</p>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">online</p>
                                            </div>
                                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                WhatsApp
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3">
                                            <div className="text-foreground ml-auto max-w-[94%] rounded-2xl rounded-tr-xs border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-xs shadow-xs dark:bg-emerald-950/40">
                                                <p className="leading-relaxed">Fala Lucas, tudo bem por aí? 👋</p>
                                                <p className="mt-2 leading-relaxed">
                                                    Passando só pra te mandar o Pix daquela parcela do churrasco da turma que combinamos pra hoje (R$
                                                    75,00).
                                                </p>

                                                <div className="bg-background/80 mt-3 rounded-lg border border-emerald-500/30 p-2.5">
                                                    <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                                                        Pix Copia e Cola
                                                    </p>
                                                    <p className="truncate font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                                                        00020126580014br.gov.bcb.pix...
                                                    </p>
                                                </div>

                                                <p className="text-muted-foreground mt-2 text-[11px]">
                                                    Valeu demais meu amigo! Qualquer coisa me dá um toque aqui. 🤝
                                                </p>

                                                <div className="text-muted-foreground mt-2 flex items-center justify-end gap-1 text-[10px]">
                                                    <span>14:32</span>
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓✓</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-center">
                                            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                ✨ O app gera essa mensagem e você abre no WhatsApp com 1 toque
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Por que não Excel / Bloco de notas? (Reality Check) */}
                    <section id="comparativo" className="border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    "Mas eu já anoto no bloco de notas ou numa planilha..."
                                </h2>
                                <p className="text-muted-foreground mt-3 text-base">
                                    Será que funciona mesmo? Veja a diferença entre tentar improvisar e ter uma ferramenta feita só pra isso:
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {/* Bloco de notas */}
                                <div className="bg-card flex flex-col justify-between rounded-xl border p-6 shadow-xs">
                                    <div>
                                        <div className="bg-muted text-muted-foreground mb-4 flex size-10 items-center justify-center rounded-lg">
                                            <Smartphone className="size-5" />
                                        </div>
                                        <h3 className="text-lg font-bold">Bloco de Notas do celular</h3>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                            Você digita "Carlos deve 100", mas não tem data de vencimento, não calcula parcelas e logo se perde no
                                            meio de senhas e listas de compras.
                                        </p>
                                    </div>
                                    <div className="text-destructive mt-6 flex items-center gap-2 border-t pt-4 text-xs font-semibold">
                                        <X className="size-4" /> Vira um cemitério de notas esquecidas
                                    </div>
                                </div>

                                {/* Planilha Excel */}
                                <div className="bg-card flex flex-col justify-between rounded-xl border p-6 shadow-xs">
                                    <div>
                                        <div className="bg-muted text-muted-foreground mb-4 flex size-10 items-center justify-center rounded-lg">
                                            <Calendar className="size-5" />
                                        </div>
                                        <h3 className="text-lg font-bold">Planilha no Excel / Sheets</h3>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                            Fazer fórmulas no computador é bonito, mas ninguém tem saco de abrir planilha cheia de colunas na tela
                                            pequena do celular na rua.
                                        </p>
                                    </div>
                                    <div className="text-destructive mt-6 flex items-center gap-2 border-t pt-4 text-xs font-semibold">
                                        <X className="size-4" /> Fica desatualizada em poucos dias
                                    </div>
                                </div>

                                {/* Quem me deve */}
                                <div className="border-primary bg-primary/5 flex flex-col justify-between rounded-xl border-2 p-6 shadow-sm">
                                    <div>
                                        <div className="bg-primary text-primary-foreground mb-4 flex size-10 items-center justify-center rounded-lg">
                                            <Sparkles className="size-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-foreground text-lg font-bold">Quem me deve</h3>
                                            <Badge className="text-[10px]">Sob medida</Badge>
                                        </div>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                            Leva 15 segundos: você cadastra o devedor, define o vencimento das parcelas e dá baixa com 1 toque quando
                                            o Pix cair. Leve, rápido e sem frescura.
                                        </p>
                                    </div>
                                    <div className="border-primary/20 text-primary mt-6 flex items-center gap-2 border-t pt-4 text-xs font-semibold">
                                        <CheckCircle2 className="size-4" /> Controle total sem esforço
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Como funciona em 3 passos */}
                    <section id="como-funciona" className="bg-muted/20 border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Como funciona na prática</h2>
                                <p className="text-muted-foreground mt-3 text-base">Tudo foi desenhado para você resolver em menos de 1 minuto.</p>
                            </div>

                            <div className="mt-12 grid gap-8 md:grid-cols-3">
                                {steps.map((item) => (
                                    <div key={item.step} className="bg-background relative flex flex-col rounded-xl border p-6 shadow-xs">
                                        <span className="text-primary/40 mb-3 font-mono text-3xl font-black">{item.step}</span>
                                        <h3 className="text-lg font-bold">{item.title}</h3>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Planos */}
                    <section id="planos" className="border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Planos claros, sem letras miúdas</h2>
                                <p className="text-muted-foreground mt-3 text-base">
                                    Comece 100% grátis e só passe para um plano maior se o volume de devedores aumentar.
                                </p>
                            </div>

                            <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {plans.map((plan) => (
                                    <Card
                                        key={plan.name}
                                        className={`flex flex-col justify-between ${
                                            plan.highlight ? 'border-primary shadow-primary/10 relative border-2 shadow-lg' : 'bg-background border'
                                        }`}
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                                                {plan.badge && <Badge className="text-xs">{plan.badge}</Badge>}
                                            </div>
                                            <CardDescription className="mt-1.5 min-h-10 text-xs leading-relaxed">{plan.description}</CardDescription>
                                            <div className="pt-4">
                                                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                                                <span className="text-muted-foreground text-sm">{plan.period}</span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex flex-col gap-2.5 border-t border-b py-4">
                                            {plan.limits.map((limit) => (
                                                <div key={limit} className="flex items-center gap-2 text-xs font-semibold">
                                                    <Check className="text-primary size-4 shrink-0" />
                                                    <span>{limit}</span>
                                                </div>
                                            ))}
                                            {plan.extras.map((extra) => (
                                                <div key={extra} className="text-muted-foreground flex items-center gap-2 text-xs">
                                                    <Check className="text-primary/70 size-4 shrink-0" />
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
                            <p className="text-muted-foreground mt-8 text-center text-xs">
                                Cancele quando quiser. Sem fidelidade ou taxas escondidas.
                            </p>
                        </div>
                    </section>

                    {/* Perguntas Frequentes (FAQ) */}
                    <section id="faq" className="border-b py-16 sm:py-24">
                        <div className="mx-auto max-w-5xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                                    <HelpCircle className="size-3.5" /> Dúvidas Frequentes
                                </span>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Tudo o que você precisa saber antes de começar</h2>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
                                    Transparência total. Sem pegadinhas, sem taxas escondidas e sem complicação.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-2">
                                {faqs.map((faq) => (
                                    <div key={faq.question} className="bg-card rounded-xl border p-6 shadow-xs">
                                        <h3 className="text-foreground text-base leading-snug font-semibold">{faq.question}</h3>
                                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-primary/20 bg-primary/5 mt-10 rounded-xl border p-6 text-center">
                                <p className="text-foreground text-sm font-semibold">Ainda ficou com alguma dúvida antes de criar sua conta?</p>
                                <p className="text-muted-foreground mt-1 text-xs">Nosso suporte responde você diretamente pelo WhatsApp.</p>
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                                    <a
                                        href="https://wa.me/5531997760109?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20antes%20de%20criar%20minha%20conta%20no%20Quem%20me%20deve"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
                                    >
                                        <MessageCircle className="size-4" />
                                        Tirar dúvida no WhatsApp (31) 99776-0109
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contato & Suporte */}
                    <section id="contato" className="bg-muted/20 border-t py-16 sm:py-20">
                        <div className="mx-auto max-w-6xl px-4 sm:px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <MessageCircle className="size-3.5" /> Atendimento & Suporte
                                </span>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Fale diretamente conosco</h2>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    Dúvidas sobre planos, sugestões de melhoria ou suporte técnico? Estamos à disposição.
                                </p>
                            </div>

                            <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                                <a
                                    href="https://wa.me/5531997760109?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Quem%20me%20deve"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-background flex items-center gap-3 rounded-xl border p-4 shadow-xs transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-md"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                        <MessageCircle className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-xs">Chamar no WhatsApp</p>
                                        <p className="text-foreground text-sm font-bold">(31) 99776-0109</p>
                                    </div>
                                </a>

                                <a
                                    href="mailto:marcos-oliveirasilva@hotmail.com"
                                    className="bg-background hover:border-primary/40 hover:bg-primary/5 flex items-center gap-3 rounded-xl border p-4 shadow-xs transition-all hover:shadow-md"
                                >
                                    <div className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                                        <Mail className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-xs">Enviar um E-mail</p>
                                        <p className="text-foreground truncate text-xs font-bold">marcos-oliveirasilva@hotmail.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Chamada Final Humanizada */}
                    <section className="py-16 sm:py-24">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6">
                            <div className="bg-muted/40 rounded-2xl border p-8 text-center shadow-xs sm:p-12">
                                <span className="bg-primary/10 text-primary mb-4 inline-flex size-12 items-center justify-center rounded-xl">
                                    <Clock className="size-6" />
                                </span>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chega de perder dinheiro por pura distração</h2>
                                <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-sm leading-relaxed sm:text-base">
                                    Crie sua conta em menos de 1 minuto, anote quem te deve e tenha a tranquilidade de saber que sua grana está
                                    organizada.
                                </p>
                                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    <Button size="lg" asChild className="gap-2 px-8 text-base shadow-md">
                                        <Link href={auth.user ? route('dashboard') : route('register')}>
                                            {auth.user ? 'Ir para o Dashboard' : 'Criar minha conta grátis'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                                <p className="text-muted-foreground mt-4 text-xs">
                                    ⚡ 100% grátis · Sem cartão de crédito · Seus registros são privados
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Rodapé */}
                <PublicFooter />
            </div>
        </>
    );
}
