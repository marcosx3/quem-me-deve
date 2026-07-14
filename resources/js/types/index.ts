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
    plan_id: number;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
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
    };
    descricao: string;
    valor_total: string;
    qtd_parcelas: number;
    data_primeira_parcela: string;
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
