import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { FileText, Mail, MessageCircle, Shield } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="bg-muted/20 border-t">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Coluna 1: Marca & CNPJ */}
                    <div className="space-y-3 md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md shadow-xs">
                                <AppLogoIcon className="size-4" />
                            </span>
                            <span className="text-foreground font-bold">Quem me deve</span>
                        </Link>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            A ferramenta simples e direta para registrar quem te deve, acompanhar parcelas e receber sem constrangimento.
                        </p>
                        <div className="text-muted-foreground pt-2 text-xs">
                            <span className="text-foreground font-semibold">CNPJ:</span> 51.921.737/0001-88
                        </div>
                    </div>

                    {/* Coluna 2: Navegação & Produto */}
                    <div className="space-y-3">
                        <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">Produto</h4>
                        <ul className="text-muted-foreground space-y-2 text-xs">
                            <li>
                                <Link href="/#como-funciona" className="hover:text-foreground transition-colors">
                                    Como funciona
                                </Link>
                            </li>
                            <li>
                                <Link href="/#cenarios" className="hover:text-foreground transition-colors">
                                    Para quem é?
                                </Link>
                            </li>
                            <li>
                                <Link href="/#planos" className="hover:text-foreground transition-colors">
                                    Planos e Preços
                                </Link>
                            </li>
                            <li>
                                <Link href="/#comparativo" className="hover:text-foreground transition-colors">
                                    Por que não o Excel?
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Legal & Privacidade */}
                    <div className="space-y-3">
                        <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">Legal & Privacidade</h4>
                        <ul className="text-muted-foreground space-y-2 text-xs">
                            <li>
                                <Link href={route('termos')} className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
                                    <FileText className="size-3.5" />
                                    <span>Termos de Uso</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route('privacidade')}
                                    className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                                >
                                    <Shield className="size-3.5" />
                                    <span>Política de Privacidade</span>
                                </Link>
                            </li>
                            <li className="text-muted-foreground pt-1 text-[11px] leading-relaxed">
                                Plataforma em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 4: Contato & Suporte */}
                    <div className="space-y-3">
                        <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">Canais de Contato</h4>
                        <p className="text-muted-foreground text-xs">Dúvidas, sugestões ou suporte técnico:</p>
                        <div className="space-y-2 pt-1 text-xs">
                            <a
                                href="https://wa.me/5531997760109?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Quem%20me%20deve"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
                            >
                                <MessageCircle className="size-4 shrink-0" />
                                <span>(31) 99776-0109</span>
                            </a>
                            <div>
                                <a
                                    href="mailto:marcos-oliveirasilva@hotmail.com"
                                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 break-all hover:underline"
                                >
                                    <Mail className="size-4 shrink-0" />
                                    <span>marcos-oliveirasilva@hotmail.com</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linha Inferior */}
                <div className="text-muted-foreground mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-center text-xs sm:flex-row sm:text-left">
                    <p>© {new Date().getFullYear()} Quem me deve — CNPJ: 51.921.737/0001-88. Todos os direitos reservados.</p>
                    <p>Feito para quem preza pela paz de espírito e quer o próprio dinheiro de volta.</p>
                </div>
            </div>
        </footer>
    );
}
