import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import PublicFooter from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Database, Lock, Mail, MessageCircle, Shield, UserCheck } from 'lucide-react';

export default function Privacidade() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Política de Privacidade - Quem me deve" />

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
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <Shield className="size-3.5" />
                            <span>LGPD Compliant</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Política de Privacidade</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Última atualização: Outubro de 2026. Esta política detalha como coletamos, tratamos e protegemos seus dados pessoais de
                            acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
                        </p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 pt-8 text-sm leading-relaxed">
                        {/* 1. Controlador dos Dados */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">1. Controlador dos Dados</h2>
                            <p className="text-muted-foreground">
                                Para os fins da legislação de privacidade e proteção de dados, o controlador dos dados coletados através da plataforma{' '}
                                <strong>Quem me deve</strong> (https://quemedeve.com.br) é a pessoa jurídica inscrita no{' '}
                                <strong>CNPJ nº 51.921.737/0001-88</strong>.
                            </p>
                        </section>

                        {/* 2. Dados Coletados */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">2. Quais Dados Coletamos</h2>
                            <p className="text-muted-foreground">
                                Coletamos apenas as informações estritamente necessárias para a prestação do serviço:
                            </p>

                            <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                                <div className="bg-muted/20 space-y-2 rounded-lg border p-4">
                                    <div className="text-foreground flex items-center gap-2 font-semibold">
                                        <UserCheck className="text-primary size-4" />
                                        <span>Dados do Usuário Titular</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        Nome completo, endereço de e-mail, senha criptografada (hash BCRYPT de alta complexidade), número de telefone
                                        (opcional) e chave Pix para recebimento cadastrada no perfil (opcional).
                                    </p>
                                </div>

                                <div className="bg-muted/20 space-y-2 rounded-lg border p-4">
                                    <div className="text-foreground flex items-center gap-2 font-semibold">
                                        <Database className="text-primary size-4" />
                                        <span>Dados Inseridos pelo Usuário</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        Nome de contatos/devedores informados, número de telefone de contato (para envio de link no WhatsApp),
                                        descrição dos empréstimos/recebíveis, datas de vencimento e valores devidos.
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground pt-1 text-xs">
                                <strong>Dados Técnicos de Navegação:</strong> Registramos requisições de página com endereço IP anonimizado através de
                                hash criptográfico irreversível (SHA-256 com salt seguro), identificador de navegador (User-Agent) e data/hora,
                                impedindo a rastreabilidade individual invasiva e atendendo a métricas de tráfego de forma anônima.
                            </p>
                        </section>

                        {/* 3. Finalidades */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">3. Finalidade e Bases Legais do Tratamento</h2>
                            <p className="text-muted-foreground">O tratamento dos seus dados fundamenta-se nas seguintes hipóteses legais da LGPD:</p>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>
                                    <strong>Execução de Contrato (Art. 7º, V):</strong> Permitir que você cadastre suas dívidas, organize parcelas,
                                    calcule juros/multa configurados e gere mensagens de lembrete com QR Code e Pix Copia e Cola.
                                </li>
                                <li>
                                    <strong>Cumprimento de Obrigação Legal (Art. 7º, II):</strong> Manter registros de data, hora e conexões para
                                    atender ao Marco Civil da Internet (Lei nº 12.965/2014).
                                </li>
                                <li>
                                    <strong>Legítimo Interesse (Art. 7º, IX):</strong> Melhorar a estabilidade do sistema, gerar relatórios de
                                    métricas agregadas e prevenir fraudes e abusos cibernéticos.
                                </li>
                            </ul>
                        </section>

                        {/* 4. Não Comercialização */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">4. Não Compartilhamento e Não Comercialização de Dados</h2>
                            <div className="border-primary/20 bg-primary/5 space-y-1.5 rounded-lg border p-4 text-xs">
                                <p className="text-foreground flex items-center gap-1.5 font-semibold">
                                    <Lock className="text-primary size-4" />
                                    Compromisso com a sua Privacidade:
                                </p>
                                <p className="text-muted-foreground">
                                    O <strong>Quem me deve</strong> NÃO vende, aluga, troca ou comercializa qualquer dado pessoal ou financeiro
                                    cadastrado na plataforma com birôs de crédito, agências de publicidade ou anunciantes terceiros.
                                </p>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                O compartilhamento ocorre exclusivamente com parceiros tecnológicos indispensáveis para o funcionamento do serviço:
                                provedores de nuvem segura (armazenamento e servidores) e gateways de pagamento regulados (ex: AbacatePay) para
                                processamento das assinaturas pagas.
                            </p>
                        </section>

                        {/* 5. Segurança */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">5. Segurança da Informação</h2>
                            <p className="text-muted-foreground">
                                Adotamos rigorosas medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perdas
                                ou alterações acidentais:
                            </p>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>Criptografia de ponta a ponta nas transmissões de rede via protocolo HTTPS com certificados TLS modernos.</li>
                                <li>Senhas criptografadas utilizando algoritmo hash irreversível BCRYPT.</li>
                                <li>Proteção contra ataques de injeção SQL, Cross-Site Scripting (XSS) e Cross-Site Request Forgery (CSRF).</li>
                                <li>Controle de acesso restrito e autenticação protegida por senhas fortes.</li>
                            </ul>
                        </section>

                        {/* 6. Direitos dos Titulares */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">6. Seus Direitos como Titular (Art. 18 da LGPD)</h2>
                            <p className="text-muted-foreground">
                                Você possui pleno controle sobre seus dados e tem o direito de, a qualquer momento:
                            </p>
                            <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                                <li>Confirmar a existência de tratamento e acessar seus dados.</li>
                                <li>Corrigir dados incompletos, inexatos ou desatualizados através da página de Perfil.</li>
                                <li>
                                    <strong>Excluir seus dados:</strong> Você pode realizar a exclusão completa e definitiva da sua conta e de todos
                                    os registros de dívidas e devedores a qualquer momento em <em>Configurações &gt; Perfil &gt; Excluir Conta</em>.
                                </li>
                                <li>Revogar consentimentos e solicitar esclarecimentos sobre o uso dos dados.</li>
                            </ul>
                        </section>

                        {/* 7. Cookies */}
                        <section className="space-y-3">
                            <h2 className="text-foreground text-lg font-bold">7. Uso de Cookies e Sessões</h2>
                            <p className="text-muted-foreground">
                                Utilizamos exclusivamente cookies estritamente necessários para manter sua sessão de autenticação ativa e segura
                                durante a navegação. Não utilizamos cookies de terceiros para fins de retargeting publicitário invasivo.
                            </p>
                        </section>

                        {/* 8. Canal do DPO / Contato */}
                        <section className="bg-muted/30 space-y-3 rounded-xl border p-5">
                            <h2 className="text-foreground text-base font-bold">8. Encarregado de Dados (DPO) & Atendimento</h2>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Para exercer qualquer um de seus direitos previstos na LGPD, tirar dúvidas sobre esta política ou relatar questões de
                                privacidade, contate diretamente o nosso Encarregado de Proteção de Dados:
                            </p>
                            <div className="grid grid-cols-1 gap-3 pt-2 text-xs sm:grid-cols-2">
                                <a
                                    href="https://wa.me/5531997760109?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20Privacidade%20e%20LGPD"
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
                                Responsável Legal: CNPJ 51.921.737/0001-88 — República Federativa do Brasil.
                            </p>
                        </section>
                    </div>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
