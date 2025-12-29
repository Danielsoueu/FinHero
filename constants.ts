import { Company } from './types';

export const COMPANIES: Record<string, Company> = {
    empresaA: {
        id: 'empresaA',
        nome: 'Meu Escritório Virtual',
        logoUrl: 'https://meuescritoriovirtual.com.br/wp-content/uploads/2024/04/MEV-logo_Prancheta-1.svg'
    },
    empresaB: {
        id: 'empresaB',
        nome: 'Company Hero',
        logoUrl: 'https://www.companyhero.com/companyhero-logo.svg'
    }
};

export const DEFAULT_TAXA_MULTA = 10;
export const DEFAULT_TAXA_JUROS = 0.03; // per day