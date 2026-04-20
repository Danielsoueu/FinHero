export type Language = 'pt' | 'en' | 'es';

export type CurrencyCode = 'BRL' | 'USD' | 'CLP' | 'ARS' | 'PYG' | 'EUR' | 'PEN';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    locale: string;
    name: string;
    decimals: number;
}

export interface Company {
    id: 'empresaA' | 'empresaB';
    nome: string;
    logoUrl: string;
    cnpj?: string;
}

export interface DebtItem {
    id: string;
    titulo: string;
    valorOriginal: number;
    dataVencimento: string;
    dataPagamento: string;
    multa: number;
    juros: number;
    total: number;
    devido: number;
    desconto: number;
    status: 'Vencida' | 'Não Vencida' | 'Pago' | 'Overdue' | 'Not Due' | 'Paid' | 'Vencida' | 'No Vencida' | 'Pagado';
    diasAtraso: number;
}

export interface ReceiptItem {
    id: string;
    descricao: string;
    plano: string;
    formaPagamento: string;
    valor: number;
}

export interface InvoiceItem {
    id: string;
    titulo: string;
    valor: number;
}

export enum TabId {
    HOME = 'home',
    JUROS = 'juros',
    PORCENTAGEM = 'porcentagem',
    CANCELAMENTO = 'cancelamento',
    PAGAMENTO = 'pagamento',
    NEGOCIACAO = 'negociacao',
    CUPONS = 'cupons',
    CNPJ = 'cnpj',
    ENDERECOS = 'enderecos'
}

export interface CancellationItem {
    id: string;
    service: string;
    date: string;
    value: number;
}
