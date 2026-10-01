import { Company } from './types';
import { MEV_BRAND, HERO_BRAND } from './utils/branding';

export const COMPANIES: Record<string, Company> = {
    empresaA: {
        id: 'empresaA',
        nome: 'Meu Escritório Virtual',
        logoUrl: 'https://meuescritoriovirtual.com.br/wp-content/uploads/2024/04/MEV-logo_Prancheta-1.svg',
        cnpj: '18.494.398/0001-44',
        brand: MEV_BRAND
    },
    empresaB: {
        id: 'empresaB',
        nome: 'Company Hero',
        logoUrl: 'https://www.companyhero.com/companyhero-logo.svg',
        cnpj: '29.356.126/0001-08',
        brand: HERO_BRAND
    }
};

export const DEFAULT_TAXA_MULTA = 10;
export const DEFAULT_TAXA_JUROS = 0.03; // per day