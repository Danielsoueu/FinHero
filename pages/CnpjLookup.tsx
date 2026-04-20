import React, { useState, useMemo } from 'react';
import { Building2, Search, Phone, Mail, MapPin, Briefcase, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { units } from '../constants/units';

interface CnpjData {
    razao_social: string;
    nome_fantasia: string;
    porte: string;
    descricao_situacao_cadastral: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    ddd_telefone_1: string;
    email: string;
}

const CnpjLookup: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CnpjData | null>(null);

    const isOurUnit = useMemo(() => {
        if (!data) return null;

        const clean = (str: string) => {
            return str.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/\s+/g, ' ') // Collapse spaces
                .trim();
        };

        const expandAbbreviations = (str: string) => {
            return str
                .replace(/\bav\b|\bave\b/g, 'avenida')
                .replace(/\br\b/g, 'rua')
                .replace(/\bpref\b/g, 'prefeito')
                .replace(/\bdr\b/g, 'doutor')
                .replace(/\bcj\b/g, 'conjunto')
                .replace(/\bsl\b/g, 'sala');
        };

        const normalize = (str: string) => {
            let s = clean(str);
            s = expandAbbreviations(s);
            // Remove everything that isn't alphanumeric for final comparison
            return s.replace(/[^a-z0-9]/g, '');
        };

        const dataCep = data.cep.replace(/\D/g, '');
        const dataStreet = normalize(data.logradouro);
        const dataNum = normalize(data.numero);

        // 1. Try physical match first (Street AND Number) - Most precise
        // We check if the unit address contains the normalized street name AND the number
        const physicalMatch = units.find(u => {
            const unitAddr = normalize(u.address);
            // Check if street name is part of unit address (e.g., "osmarcunha" in "avenidaprefeitoosmarcunha")
            return unitAddr.includes(dataStreet) && unitAddr.includes(dataNum);
        });

        if (physicalMatch) return physicalMatch;

        // 2. Fallback to CEP match - more lenient verification
        return units.find(u => {
            const unitCep = u.cep ? u.cep.replace(/\D/g, '') : '';
            if (unitCep !== dataCep) return false;
            
            // If CEP matches, check if the street name even vaguely matches
            const unitAddr = normalize(u.address);
            // A common street fragment should match
            return unitAddr.includes(dataStreet) || dataStreet.includes(unitAddr.substring(0, 5));
        });
    }, [data]);

    const formatCnpj = (val: string) => {
        const d = val.replace(/\D/g, '').slice(0, 14);
        if (d.length <= 2) return d;
        if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
        if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
        if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
        return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatCnpj(value);
        setCnpj(formatted);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const formatted = formatCnpj(pastedData);
        setCnpj(formatted);
    };

    const buscarCNPJ = async () => {
        const cnpjLimpo = cnpj.replace(/\D/g, '');

        if (cnpjLimpo.length !== 14) {
            addToast(t('cnpj.error_length'), 'error');
            return;
        }

        setLoading(true);
        setData(null);

        try {
            const response = await fetch(`/api/cnpj?cnpj=${cnpjLimpo}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || t('cnpj.error_not_found'));
            }

            const d = await response.json();
            setData(d);
        } catch (err: any) {
            addToast(err.message || t('cnpj.error_generic'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {t('cnpj.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {t('cnpj.subtitle')}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-hero border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        value={cnpj}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        placeholder={t('cnpj.placeholder')}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-pink dark:focus:border-brand-pink outline-none transition-all pr-16"
                        maxLength={18}
                        onKeyDown={(e) => e.key === 'Enter' && buscarCNPJ()}
                    />
                    <button
                        onClick={buscarCNPJ}
                        disabled={loading}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-pink text-white rounded-xl shadow-glow hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center p-0"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Search size={22} />
                        )}
                    </button>
                </div>

                <button
                    onClick={buscarCNPJ}
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-hero hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                    {loading ? t('cnpj.searching') : t('cnpj.button')}
                </button>

                {data && (
                    <div className="mt-8 space-y-6 animate-fade-in pt-8 border-t border-slate-100 dark:border-slate-800">
                        {isOurUnit && (
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 animate-bounce-subtle">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 dark:text-emerald-400">{t('cnpj.our_address')}</h4>
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-500/80">
                                        {t('cnpj.our_address_desc')} — <span className="font-black underline decoration-2 underline-offset-4">{isOurUnit.name}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${data.descricao_situacao_cadastral === 'ATIVA' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {t('cnpj.label_status')}
                                    </span>
                                    <span className={`text-sm font-black ${data.descricao_situacao_cadastral === 'ATIVA' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {data.descricao_situacao_cadastral}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Info size={16} className="text-brand-pink" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {t('cnpj.label_porte')}
                                    </span>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                                        {data.porte || t('cnpj.no_info')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard
                                icon={<Building2 size={20} />}
                                label={t('cnpj.label_razao')}
                                value={data.razao_social}
                            />
                            <InfoCard
                                icon={<Briefcase size={20} />}
                                label={t('cnpj.label_fantasia')}
                                value={data.nome_fantasia || t('cnpj.no_fantasia')}
                            />
                            <InfoCard
                                icon={<MapPin size={20} />}
                                label={t('cnpj.label_endereco')}
                                value={`${data.logradouro}, ${data.numero} ${data.complemento ? '- ' + data.complemento : ''} | ${data.bairro} | ${data.municipio}-${data.uf} | CEP: ${data.cep}`}
                                fullWidth
                            />
                            <InfoCard
                                icon={<Phone size={20} />}
                                label={t('cnpj.label_contato')}
                                value={
                                    (data.ddd_telefone_1 
                                        ? `(${data.ddd_telefone_1.substring(0, 2)}) ${data.ddd_telefone_1.substring(2)}` 
                                        : t('cnpj.no_tel')) + 
                                    (data.email ? ` | ${data.email.toLowerCase()}` : "")
                                }
                                fullWidth
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, fullWidth }) => {
    return (
        <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-pink">
                    {icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {label}
                </span>
            </div>
            <p className="text-slate-900 dark:text-white font-bold leading-relaxed break-words">
                {value}
            </p>
        </div>
    );
};

export default CnpjLookup;
