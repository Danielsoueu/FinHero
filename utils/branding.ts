import { Company, CompanyBrand } from '../types';

export const MEV_BRAND: CompanyBrand = {
    primaryColor: '#0A20FF',
    secondaryColor: '#046BD2',
    accentColor: '#00D2FF',
    darkColor: '#1E293B',
    lightColor: '#F0F5FA',
    tintBg: '#F4F8FD',
    borderColor: '#DCE7F5',
    badgeBg: '#EBF1FF',
    badgeText: '#0A20FF',
    codePrefix: 'MEV',
    tagline: 'Endereço Fiscal, Comercial e Gestão de Correspondência Inteligente',
    corporateName: 'MEU ESCRITÓRIO VIRTUAL LTDA',
    websiteUrl: 'meuescritoriovirtual.com.br',
    gradientTotal: 'linear-gradient(135deg, #0A20FF 0%, #033ECD 100%)',
    sealText: 'DOCUMENTO OFICIAL • AUTENTICIDADE DIGITAL MEV'
};

export const HERO_BRAND: CompanyBrand = {
    primaryColor: '#FF0066',
    secondaryColor: '#E6005C',
    accentColor: '#667085',
    darkColor: '#101828',
    lightColor: '#FFF1F2',
    tintBg: '#F8FAFC',
    borderColor: '#F1F5F9',
    badgeBg: '#FFF1F2',
    badgeText: '#FF0066',
    codePrefix: 'HERO',
    tagline: 'Soluções Digitais e Infraestrutura Empresarial',
    corporateName: 'COMPANY HERO SERVIÇOS DIGITAIS',
    websiteUrl: 'companyhero.com',
    gradientTotal: 'linear-gradient(135deg, #101828 0%, #1E293B 100%)',
    sealText: 'AUTENTICAÇÃO DIGITAL HERO • DOCUMENTO OFICIAL'
};

export const getCompanyBrand = (company?: Company | null): CompanyBrand => {
    if (company?.id === 'empresaA') {
        return MEV_BRAND;
    }
    return HERO_BRAND;
};

export const isMevCompany = (company?: Company | null): boolean => {
    return company?.id === 'empresaA';
};

export const generateProtocol = (prefix: string = 'DOC', customCode?: number | string): string => {
    const num = customCode || Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
};
