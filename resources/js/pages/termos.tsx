import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import PublicFooter from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Termos() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Termos de Uso - Quem me deve" />

            <div className="bg-background text-foreground flex min-h-screen flex-col justify-between">
                {/* Navbar Simples */}
                <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href="/" className="flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90">
                            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-xs">
                                <AppLogoIcon className="size-5" />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-base leading-none font-bold tracking-tight">Quem me deve</span>
                                <span className="text-muted-foreground text-[10px] font-normal">Controle de empréstimos</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3">
                            <AppearanceToggleDropdown />
                            <Button variant="outline" size="sm" asChild className="gap-1.5">
                                <Link href="/">
                                    <ArrowLeft className="size-4" />
                                    <span>Voltar ao início</span>
                                </Link>
                            </Button>
                            {auth.user ? (
                                <Button size="sm" asChild>
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <Button size="sm" asChild>
                                    <Link href={route('login')}>Entrar</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Conteúdo Principal */}
                <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6">
                    <div className="space-y-4 border-b pb-8">
                        <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
                            <FileText className="size-3.5" />
                            <span>Documento Legal</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Termos de Uso</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Última atualização: Outubro de 2026. Por favor, leia atentamente estes termos antes de utilizar a plataforma.
                        </p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 pt-8 text-sm leading-relaxed">
                        {/* 1. Apresentação */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">1. Identificação e Apresentação</h2>
                            <p className="text-muted-foreground">
                                Bem-vindo ao <strong>Quem me deve</strong> (acessível pelo endereço eletrônico{' '}
                                <a href="https://quemedeve.com.br" className="text-primary font-medium hover:underline">
                                    https://quemedeve.com.br
                                </a>
                                ), uma plataforma digital desenvolvida para auxiliar pessoas e profissionais autônomos na gestão, organização e
                                acompanhamento de recebíveis, dívidas e empréstimos pessoais e informais.
                            </p>
                            <p className="text-muted-foreground">
                                Os serviços são operados e de titularidade da entidade inscrita no Cadastro Nacional da Pessoa Jurídica sob o{' '}
                                <strong>CNPJ nº 51.921.737/0001-88</strong>.
                            </p>
                        </section>

                        {/* 2. Natureza dos Serviços */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">2. Natureza dos Serviços Prestados</h2>
                            <p className="text-muted-foreground">
                                O <strong>Quem me deve</strong> é estritamente um <em>software como serviço</em> (SaaS) de gestão e anotação
                                financeira pessoal.
                            </p>
                            <div className="space-y-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-900 dark:text-amber-200">
                                <p className="flex items-center gap-1.5 font-semibold">
                                    <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                                    Aviso Legal Importante:
                                </p>
                                <p>
                                    A plataforma <strong>NÃO</strong> é uma instituição bancária, financeira, cooperativa de crédito ou empresa de
                                    cobrança judicial. O Quem me deve não concede empréstimos diretamente, não custodia recursos de terceiros e não
                                    garante o pagamento ou solvência de qualquer dívida cadastrada pelos usuários.
                                </p>
                            </div>
                        </section>

                        {/* 3. Cadastro e Segurança */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">3. Cadastro e Segurança da Conta</h2>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>
                                    Para utilizar os recursos da plataforma, o usuário deve criar uma conta fornecendo dados verídicos, exatos e
                                    atualizados.
                                </li>
                                <li>
                                    O usuário é o único responsável pela guarda e confidencialidade de sua senha de acesso, bem como por qualquer
                                    atividade realizada sob sua conta.
                                </li>
                                <li>
                                    É proibido o compartilhamento de contas com terceiros não autorizados ou o uso de dados de terceiros sem
                                    consentimento prévio.
                                </li>
                            </ul>
                        </section>

                        {/* 4. Responsabilidade pelo Conteúdo e Cobrança */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">4. Responsabilidade do Usuário e Práticas de Cobrança</h2>
                            <p className="text-muted-foreground">
                                Ao cadastrar dívidas, devedores, números de telefone e lembretes de pagamento, o usuário declara e concorda que:
                            </p>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>Possui relação prévia e legítima com a pessoa ou cliente cadastrado.</li>
                                <li>
                                    O envio de mensagens via WhatsApp através dos atalhos fornecidos pela plataforma deve ocorrer com respeito à
                                    honra, intimidade e sossego do devedor, sendo expressamente vedadas cobranças vexatórias, ameaçadoras ou abusivas,
                                    em estrito cumprimento ao Art. 42 e Art. 71 do Código de Defesa do Consumidor (Lei nº 8.078/1990).
                                </li>
                                <li>
                                    O Quem me deve não realiza disparos automatizados não solicitados (SPAM) e não tem acesso às conversas privadas do
                                    usuário em seu dispositivo.
                                </li>
                            </ul>
                        </section>

                        {/* 5. Planos e Pagamentos */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">5. Planos, Assinaturas e Cancelamento</h2>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>
                                    <strong>Plano Gratuito:</strong> Acesso a funcionalidades essenciais, com limite de devedores e dívidas conforme
                                    especificado na página de planos.
                                </li>
                                <li>
                                    <strong>Planos Pagos (Pro e Premium):</strong> Acesso a limites expandidos, relatórios avançados de fluxo de
                                    caixa, geração dinâmica de Pix Copia e Cola e recursos adicionais.
                                </li>
                                <li>
                                    <strong>Cancelamento:</strong> As assinaturas podem ser canceladas a qualquer momento diretamente pelo usuário,
                                    sem multa de fidelidade, mantendo-se o acesso até o término do ciclo mensal já contratado.
                                </li>
                                <li>
                                    <strong>Direito de Arrependimento:</strong> Conforme o Artigo 49 do Código de Defesa do Consumidor, na primeira
                                    contratação de plano pago, o usuário poderá solicitar o reembolso integral no prazo de até 7 (sete) dias corridos
                                    após a confirmação do pagamento.
                                </li>
                            </ul>
                        </section>

                        {/* 6. Propriedade Intelectual */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">6. Propriedade Intelectual</h2>
                            <p className="text-muted-foreground">
                                Todo o código-fonte, layout, logotipos, elementos visuais, textos e marcas associadas ao <strong>Quem me deve</strong>{' '}
                                são de propriedade exclusiva do detentor dos direitos autorais sob o <strong>CNPJ 51.921.737/0001-88</strong>. É
                                proibida a cópia, reprodução, engenharia reversa ou comercialização não autorizada da plataforma.
                            </p>
                        </section>

                        {/* 7. Alterações */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">7. Alterações nos Termos</h2>
                            <p className="text-muted-foreground">
                                O Quem me deve reserva-se o direito de atualizar estes Termos periodicamente para refletir melhorias no produto ou
                                adequações legislativas. Quando houver alterações relevantes, os usuários serão comunicados através do aplicativo ou
                                por e-mail.
                            </p>
                        </section>

                        {/* 8. Contato e Foro */}
                        <section className="bg-muted/30 space-y-3 rounded-xl border p-5">
                            <h2 className="text-foreground text-base font-bold">8. Canais de Contato & Legislação Aplicável</h2>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Para qualquer dúvida sobre estes Termos de Uso ou suporte relacionado à plataforma, entre em contato através dos
                                nossos canais oficiais:
                            </p>
                            <div className="grid grid-cols-1 gap-3 pt-2 text-xs sm:grid-cols-2">
                                <a
                                    href="https://wa.me/5531997760109?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20os%20Termos%20de%20Uso"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-background hover:bg-muted flex items-center gap-2 rounded-lg border p-3 text-emerald-600 transition-colors dark:text-emerald-400"
                                >
                                    <MessageCircle className="size-4 shrink-0" />
                                    <span>WhatsApp: (31) 99776-0109</span>
                                </a>
                                <a
                                    href="mailto:marcos-oliveirasilva@hotmail.com"
                                    className="bg-background text-foreground hover:bg-muted flex items-center gap-2 rounded-lg border p-3 transition-colors"
                                >
                                    <Mail className="text-primary size-4 shrink-0" />
                                    <span className="truncate">marcos-oliveirasilva@hotmail.com</span>
                                </a>
                            </div>
                            <p className="text-muted-foreground pt-2 text-[11px]">
                                Estes Termos são regidos pelas leis da República Federativa do Brasil, elegendo-se o foro competente nos termos da
                                legislação de proteção ao consumidor.
                            </p>
                        </section>
                    </div>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
