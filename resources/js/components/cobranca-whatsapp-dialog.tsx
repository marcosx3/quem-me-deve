import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Check, Copy, ExternalLink, MessageCircle, QrCode, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export interface CobrancaParcela {
    id: number;
    numero: number;
    valor: string | number;
    vencimento: string;
    status?: string;
    vencida?: boolean;
    dias_atraso?: number;
    multa_valor?: number;
    juros_valor?: number;
    valor_atualizado?: number;
}

export interface CobrancaDevedor {
    nome: string;
    telefone?: string | null;
}

interface PixData {
    tem_chave: boolean;
    chave_pix?: string;
    tipo_chave_pix?: string;
    nome_titular?: string;
    valor_original?: number;
    valor?: number;
    dias_atraso?: number;
    multa_valor?: number;
    juros_valor?: number;
    valor_atualizado?: number;
    tem_acrescimos?: boolean;
    copia_e_cola?: string | null;
    is_premium?: boolean;
}

export default function CobrancaWhatsappDialog({
    parcela,
    devedor,
    descricaoDivida = 'Empréstimo',
    trigger,
}: {
    parcela: CobrancaParcela;
    devedor: CobrancaDevedor;
    descricaoDivida?: string;
    trigger?: React.ReactNode;
}) {
    const { auth } = usePage<SharedData>().props;
    const isPremium = (auth.user.plan_id ?? 1) >= 3;

    const [open, setOpen] = useState(false);
    const [tone, setTone] = useState<'amigavel' | 'comercial' | 'atraso'>(parcela.vencida ? 'atraso' : 'amigavel');
    const [cobrarComAcrescimos, setCobrarComAcrescimos] = useState(false);
    const [pixData, setPixData] = useState<PixData | null>(null);
    const [loadingPix, setLoadingPix] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [copiedMessage, setCopiedMessage] = useState(false);
    const [copiedPix, setCopiedPix] = useState(false);

    // Carrega dados de Pix e Copia e Cola ao abrir ou alterar opção de acréscimos
    useEffect(() => {
        if (!open) return;

        setLoadingPix(true);
        const url = route('parcelas.pix', {
            parcela: parcela.id,
            com_acrescimos: cobrarComAcrescimos ? 1 : 0,
        });
        fetch(url)
            .then((res) => res.json())
            .then((data: PixData) => {
                setPixData(data);
            })
            .catch(() => {
                setPixData({ tem_chave: false });
            })
            .finally(() => {
                setLoadingPix(false);
            });
    }, [open, parcela.id, cobrarComAcrescimos]);

    const formattedDate = useMemo(() => formatDate(parcela.vencimento), [parcela.vencimento]);
    const firstName = useMemo(() => devedor.nome.split(' ')[0], [devedor.nome]);

    const temAcrescimos = Boolean(
        (parcela.vencida && parcela.valor_atualizado && parcela.valor_atualizado > Number(parcela.valor)) || pixData?.tem_acrescimos,
    );
    const diasAtraso = pixData?.dias_atraso ?? parcela.dias_atraso ?? 0;
    const multaValor = pixData?.multa_valor ?? parcela.multa_valor ?? 0;
    const jurosValor = pixData?.juros_valor ?? parcela.juros_valor ?? 0;
    const valorAtualizado = pixData?.valor_atualizado ?? parcela.valor_atualizado ?? Number(parcela.valor);

    const valorCobrado = cobrarComAcrescimos && temAcrescimos ? valorAtualizado : Number(parcela.valor);
    const formattedAmount = useMemo(() => formatCurrency(valorCobrado), [valorCobrado]);
    const formattedOriginalAmount = useMemo(() => formatCurrency(parcela.valor), [parcela.valor]);

    // Gera o texto base da mensagem
    useEffect(() => {
        let msg = '';
        const chavePixStr = pixData?.chave_pix ? `\n\nMinha chave Pix (${pixData.tipo_chave_pix ?? 'Pix'}): ${pixData.chave_pix}` : '';
        const copiaEColaStr = pixData?.copia_e_cola ? `\n\nCódigo Pix Copia e Cola:\n${pixData.copia_e_cola}` : '';

        const detalheAcrescimos = cobrarComAcrescimos && temAcrescimos ? ` (com juros/multa por ${diasAtraso}d de atraso)` : '';

        if (tone === 'amigavel') {
            const vencTexto = parcela.vencida ? `que venceu em ${formattedDate}` : `que vence em ${formattedDate}`;
            msg = `Oi ${firstName}, tudo bem? Passando só pra te lembrar da parcela ${parcela.numero} no valor de ${formattedAmount}${detalheAcrescimos} (${descricaoDivida}), ${vencTexto}.${chavePixStr}${copiaEColaStr}\n\nObrigado!`;
        } else if (tone === 'comercial') {
            const infoAtraso =
                cobrarComAcrescimos && temAcrescimos
                    ? ` O valor original de ${formattedOriginalAmount} foi atualizado para ${formattedAmount} (multa e juros por atraso).`
                    : '';
            msg = `Olá ${devedor.nome}. Lembramos do vencimento da sua parcela ${parcela.numero} referente a "${descricaoDivida}" em ${formattedDate}.${infoAtraso}${chavePixStr}${copiaEColaStr}\n\nAgradecemos a atenção!`;
        } else {
            const infoAtraso =
                cobrarComAcrescimos && temAcrescimos
                    ? ` Valor com acréscimos por atraso: ${formattedAmount} (original: ${formattedOriginalAmount}, atraso: ${diasAtraso} dias).`
                    : ` Valor: ${formattedAmount}.`;
            msg = `Olá ${devedor.nome}, tudo bem? Notamos que a parcela ${parcela.numero} (${descricaoDivida}) com vencimento em ${formattedDate} ainda consta pendente em nosso controle.${infoAtraso}${chavePixStr}${copiaEColaStr}\n\nPor gentileza, efetue o pagamento assim que possível. Caso já tenha realizado, favor desconsiderar.`;
        }

        setCustomMessage(msg);
    }, [
        tone,
        pixData,
        firstName,
        devedor.nome,
        parcela.numero,
        parcela.vencida,
        formattedAmount,
        formattedOriginalAmount,
        descricaoDivida,
        formattedDate,
        cobrarComAcrescimos,
        temAcrescimos,
        diasAtraso,
    ]);

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(customMessage);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
    };

    const handleCopyPix = () => {
        if (pixData?.copia_e_cola) {
            navigator.clipboard.writeText(pixData.copia_e_cola);
        } else if (pixData?.chave_pix) {
            navigator.clipboard.writeText(pixData.chave_pix);
        }
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 2000);
    };

    const handleSendWhatsapp = () => {
        const rawPhone = devedor.telefone ? devedor.telefone.replace(/\D/g, '') : '';
        let fullPhone = rawPhone;
        if (rawPhone.length === 10 || rawPhone.length === 11) {
            fullPhone = `55${rawPhone}`;
        }

        const encoded = encodeURIComponent(customMessage);
        const url = fullPhone ? `https://wa.me/${fullPhone}?text=${encoded}` : `https://web.whatsapp.com/send?text=${encoded}`;
        window.open(url, '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                        title="Cobrar via WhatsApp"
                    >
                        <MessageCircle className="size-3.5 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">Cobrar</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <MessageCircle className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Cobrar no WhatsApp</DialogTitle>
                            <DialogDescription>Envie um lembrete educado com chave Pix para {devedor.nome}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Resumo da Parcela */}
                    <div className="bg-muted/40 flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div>
                            <p className="text-foreground font-semibold">{devedor.nome}</p>
                            <p className="text-muted-foreground text-xs">
                                Parcela {parcela.numero} • {descricaoDivida} • Vence{parcela.vencida ? 'u' : ''} em {formattedDate}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-primary text-base font-bold">{formattedAmount}</p>
                            <div className="mt-0.5 flex items-center justify-end gap-1.5">
                                {parcela.vencida && (
                                    <Badge variant="destructive" className="h-5 text-[10px]">
                                        {diasAtraso > 0 ? `${diasAtraso}d em atraso` : 'Vencida'}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Toggle de cobrança com juros e multa */}
                    {temAcrescimos && (
                        <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs">
                            <div className="space-y-0.5">
                                <span className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
                                    <TrendingUp className="size-3.5 text-amber-600 dark:text-amber-400" />
                                    Cobrar com juros e multa por atraso
                                </span>
                                <p className="text-muted-foreground text-[11px]">
                                    Original: {formattedOriginalAmount} + Acréscimos: {formatCurrency(multaValor + jurosValor)}
                                </p>
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 select-none">
                                <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                                    {formatCurrency(valorAtualizado)}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={cobrarComAcrescimos}
                                    onChange={(e) => setCobrarComAcrescimos(e.target.checked)}
                                    className="size-4 cursor-pointer rounded border-amber-400 text-amber-600 accent-amber-600 focus:ring-amber-500"
                                />
                            </label>
                        </div>
                    )}

                    {/* Tom da Mensagem */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Tom da mensagem</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant={tone === 'amigavel' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTone('amigavel')}
                                className="h-8 text-xs font-medium"
                            >
                                😊 Amigável
                            </Button>
                            <Button
                                type="button"
                                variant={tone === 'comercial' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTone('comercial')}
                                className="h-8 text-xs font-medium"
                            >
                                💼 Comercial
                            </Button>
                            <Button
                                type="button"
                                variant={tone === 'atraso' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => setTone('atraso')}
                                className="h-8 text-xs font-medium"
                            >
                                ⚠️ Atrasado
                            </Button>
                        </div>
                    </div>

                    {/* Alerta de Chave Pix não cadastrada */}
                    {!loadingPix && pixData && !pixData.tem_chave && (
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                            <p className="font-medium">Chave Pix não cadastrada!</p>
                            <p className="text-muted-foreground mt-0.5">
                                Cadastre sua chave Pix nas{' '}
                                <Link href="/settings/profile" className="text-primary font-semibold underline">
                                    configurações do perfil
                                </Link>{' '}
                                para incluí-la automaticamente nas cobranças.
                            </p>
                        </div>
                    )}

                    {/* Destaque do Pix Copia e Cola (Premium) */}
                    {pixData?.copia_e_cola && (
                        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                            <div className="flex items-center gap-2">
                                <QrCode className="size-4 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <span className="font-semibold">Código Pix Copia e Cola gerado</span>
                                    <p className="text-muted-foreground text-[11px]">Valor exato de {formattedAmount}</p>
                                </div>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleCopyPix} className="h-7 gap-1 px-2 text-xs">
                                {copiedPix ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                                {copiedPix ? 'Copiado!' : 'Copiar Pix'}
                            </Button>
                        </div>
                    )}

                    {!isPremium && (
                        <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border p-2.5 text-xs">
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="text-primary size-3.5" />
                                <span>
                                    No <strong>Premium</strong>, geramos código Pix Copia e Cola automático com valor exato.
                                </span>
                            </div>
                            <Link href="/settings/profile#plano" className="text-primary font-semibold hover:underline">
                                Upgrade
                            </Link>
                        </div>
                    )}

                    {/* Prévia da Mensagem */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="customMessage" className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                Prévia da Mensagem (editável)
                            </Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyMessage}
                                className="text-muted-foreground hover:text-foreground h-6 gap-1 px-2 text-[11px]"
                            >
                                {copiedMessage ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                                {copiedMessage ? 'Copiado!' : 'Copiar texto'}
                            </Button>
                        </div>
                        <Textarea
                            id="customMessage"
                            rows={6}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="font-mono text-xs leading-relaxed"
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                        Fechar
                    </Button>

                    <Button type="button" onClick={handleSendWhatsapp} className="gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                        <MessageCircle className="size-4" />
                        Abrir WhatsApp
                        <ExternalLink className="size-3.5 opacity-70" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
