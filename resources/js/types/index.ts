import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: {
        success?: string | null;
        error?: string | null;
        devedorCriado?: { id: number; nome: string } | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    telefone: string | null;
    tipo_chave_pix?: 'cpf' | 'cnpj' | 'telefone' | 'email' | 'aleatoria' | null;
    chave_pix?: string | null;
    nome_titular_pix?: string | null;
    cidade_titular_pix?: string | null;
    plan_id: number;
    is_admin?: boolean;
    plan?: {
        id: number;
        slug: string;
        nome: string;
        preco_centavos: number;
        limite_devedores: number | null;
        limite_dividas: number | null;
    };
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Devedor {
    id: number;
    nome: string;
    slug: string;
    telefone: string | null;
    observacoes: string | null;
    created_at: string;
    updated_at: string;
}

export type DividaStatus = 'aberta' | 'quitada';

// Filtro de listagem: inclui 'vencida', que é derivado (aberta + parcela pendente com vencimento no passado),
// não um valor armazenado na coluna `status`.
export type DividaStatusFilter = DividaStatus | 'vencida';

export interface Divida {
    id: number;
    devedor_id: number;
    devedor: {
        id: number;
        nome: string;
        telefone?: string | null;
    };
    descricao: string;
    valor_total: string;
    qtd_parcelas: number;
    data_primeira_parcela: string;
    multa_percentual?: number | null;
    juros_mensal_percentual?: number | null;
    status: DividaStatus;
    vencida: boolean;
    parcelas_count?: number;
    parcelas_pagas_count?: number;
    parcelas_vencidas_count?: number;
    created_at: string;
    updated_at: string;
}

export interface DevedorOption {
    id: number;
    nome: string;
}

export type ParcelaStatus = 'pendente' | 'paga';

export interface Parcela {
    id: number;
    numero: number;
    valor: string;
    vencimento: string;
    status: ParcelaStatus;
    pago_em: string | null;
    vencida: boolean;
    dias_atraso?: number;
    multa_valor?: number;
    juros_valor?: number;
    valor_atualizado?: number;
}

export interface ParcelaResumo {
    id: number;
    divida_id: number;
    numero: number;
    valor: string;
    vencimento: string;
    devedor_nome: string;
    devedor_telefone?: string | null;
    descricao: string;
    dias_atraso?: number;
    multa_valor?: number;
    juros_valor?: number;
    valor_atualizado?: number;
}

export interface DashboardResumo {
    devedoresCount: number;
    dividasCount: number;
    plano: {
        nome: string | null;
        limiteDevedores: number | null;
        limiteDividas: number | null;
    };
    totais: {
        a_receber: string;
        recebido: string;
        vencidas_count: number;
    };
    proximasParcelas: ParcelaResumo[];
    parcelasVencidas: ParcelaResumo[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Shape produced by Laravel's JsonResource::collection() over a paginator.
export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: PaginationLink[];
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface RelatorioDados {
    totais: {
        total_emprestado: number;
        total_recebido: number;
        total_pendente: number;
        total_vencido: number;
        total_a_receber_geral: number;
        taxa_recuperacao: number;
        qtd_pagas: number;
        qtd_pendentes: number;
        qtd_vencidas: number;
        qtd_total_parcelas: number;
    };
    previsao: {
        dias_30: { valor: number; count: number };
        dias_60: { valor: number; count: number };
        dias_90: { valor: number; count: number };
        fluxo_mensal: Array<{
            mes: string;
            chave: string;
            valor: number;
            parcelas_count: number;
        }>;
    };
    top_devedores: Array<{
        id: number;
        nome: string;
        telefone?: string | null;
        total_devido: number;
        total_pago: number;
        total_pendente: number;
        tem_atraso: boolean;
        dividas_count: number;
    }>;
}
