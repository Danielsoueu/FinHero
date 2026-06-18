import React, { useState, useMemo } from 'react';
import { 
    Building2, Search, Phone, Mail, MapPin, Briefcase, Info, 
    AlertCircle, CheckCircle2, Layers, Copy, Trash2, 
    ExternalLink, RefreshCw, X, Check, Eye, HelpCircle, FileText
} from 'lucide-react';
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

interface BatchItem {
    cnpj: string;
    loading: boolean;
    error?: string;
    data?: CnpjData;
    matchedUnit?: typeof units[0] | null;
}

const CnpjLookup: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    
    // Core state
    const [searchMode, setSearchMode] = useState<'individual' | 'lote'>('individual');
    
    // Single CNPJ Lookup State
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CnpjData | null>(null);

    // Batch CNPJ Lookup State
    const [batchInput, setBatchInput] = useState('');
    const [batchResults, setBatchResults] = useState<BatchItem[]>([]);
    const [isSearchingBatch, setIsSearchingBatch] = useState(false);
    const [batchFilterText, setBatchFilterText] = useState('');
    const [batchFilterType, setBatchFilterType] = useState<'all' | 'matched' | 'unmatched' | 'error'>('all');
    
    // Detail Modal State
    const [selectedCompany, setSelectedCompany] = useState<{
        cnpj: string;
        data?: CnpjData;
        matchedUnit?: typeof units[0] | null;
        error?: string;
    } | null>(null);

    // Helper: Clean and check if unit matches
    const checkIfOurUnit = (cnpjData: CnpjData) => {
        const normalizeText = (str: string) => {
            return str.toLowerCase()
                .normalize('NFD') // Decomposes accents
                .replace(/[\u0300-\u036f]/g, '') // Removes accent marks
                .replace(/[^a-z0-9\s]/g, '') // Removes punctuation keeping spaces
                .replace(/\s+/g, ' ') // Collapses multiple spaces
                .trim();
        };

        const cleanStreetPrefixes = (str: string) => {
            let s = normalizeText(str);
            s = s.replace(/^(avenida|av|rua|r|praca|prc|alameda|al|rodovia|rod)\s+/g, '');
            s = s.replace(/^(doutor|dr|prefeito|pref|coronel|cel|professor|prof)\s+/g, '');
            return s;
        };

        const isStreetSimilar = (street1: string, street2: string) => {
            const s1 = cleanStreetPrefixes(street1);
            const s2 = cleanStreetPrefixes(street2);
            if (s1 === s2) return true;
            if (!s1 || !s2) return false;
            
            const stopWords = ['de', 'do', 'da', 'dos', 'das', 'em', 'para', 'com', 'sem', 'rua', 'avenida', 'alameda', 'praca'];
            const words1 = s1.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
            const words2 = s2.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
            
            if (words1.length === 0 || words2.length === 0) return false;
            
            // Intersection of words
            const intersection = words1.filter(w => 
                words2.includes(w) || 
                words2.some(w2 => w2.includes(w) || w.includes(w2))
            );
            
            if (intersection.length === 0) return false;
            
            const matchThreshold = Math.min(words1.length, words2.length) <= 2 ? 1 : Math.ceil(Math.min(words1.length, words2.length) * 0.5);
            
            if (intersection.length < matchThreshold) return false;
            
            // For single-word matching, it must be significant (>= 4 characters) or contain each other
            if (intersection.length === 1) {
                const singleWord = intersection[0];
                if (singleWord.length < 4 && !s1.includes(s2) && !s2.includes(s1)) {
                    return false;
                }
            }
            
            return true;
        };

        const dataUf = (cnpjData.uf || '').toUpperCase().trim();
        const dataCep = (cnpjData.cep || '').replace(/\D/g, '');
        const dataStreet = (cnpjData.logradouro || '');
        const dataNum = (cnpjData.numero || '').replace(/\D/g, '');
        const dataCity = (cnpjData.municipio || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');

        if (!dataUf) return null;

        const matchedUnit = units.find(u => {
            // 1. State check is absolutely mandatory
            const unitUf = (u.state || '').toUpperCase().trim();
            if (dataUf !== unitUf) return false;

            // Extract street and number from unit address
            const addressParts = u.address.split(',');
            const unitStreet = addressParts[0] || '';
            const unitNum = (addressParts[1] || '').trim().replace(/\D/g, '');
            const unitCep = (u.cep || '').replace(/\D/g, '');
            
            const unitCityNorm = u.address.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '');

            // 2. City name check is highly required
            if (dataCity && !unitCityNorm.includes(dataCity)) {
                return false;
            }

            // 3. CEP match + exact building number check (highly precise)
            if (dataCep && unitCep === dataCep) {
                if (dataNum && unitNum && dataNum !== unitNum) {
                    return false;
                }
                return true;
            }

            // 4. Exact/similar Street Name match + Exact Building Number match
            if (dataNum && unitNum && dataNum === unitNum) {
                if (isStreetSimilar(unitStreet, dataStreet)) {
                    return true;
                }
            }

            return false;
        });

        return matchedUnit || null;
    };

    // Derived State for Single Lookup Match
    const isOurUnit = useMemo(() => {
        if (!data) return null;
        return checkIfOurUnit(data);
    }, [data]);

    // Format utility for display
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

    // Main Single search execution
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
            addToast('CNPJ localizado com sucesso!', 'success');
        } catch (err: any) {
            addToast(err.message || t('cnpj.error_generic'), 'error');
        } finally {
            setLoading(false);
        }
    };

    // Batch utilities
    const parseCnpjs = (text: string): string[] => {
        // Find strings separated by breaklines, commas, semicolons or spaces
        const parts = text.split(/[\n,;\s]+/);
        const validCnpjs: string[] = [];
        parts.forEach(part => {
            const cleaned = part.replace(/\D/g, '');
            if (cleaned.length === 14) {
                validCnpjs.push(cleaned);
            } else {
                // If there is any 14-digit subsequence inside
                const matches = cleaned.match(/\d{14}/g);
                if (matches) {
                    validCnpjs.push(...matches);
                }
            }
        });
        return Array.from(new Set(validCnpjs)); // distinct
    };

    const detectedCnpjs = useMemo(() => {
        return parseCnpjs(batchInput);
    }, [batchInput]);

    // Executing Batch Lookup (Safe sequencial execution to prevent rate limit blocks)
    const buscarCnpjsEmLote = async () => {
        const cnpjsToSearch = detectedCnpjs;
        if (cnpjsToSearch.length === 0) {
            addToast('Nenhum CNPJ de 14 dígitos válido foi identificado no texto inserido.', 'error');
            return;
        }
        if (cnpjsToSearch.length > 25) {
            addToast('O limite de busca em lote é de até 25 CNPJs por vez por motivos de segurança.', 'warning');
        }

        const trimmedList = cnpjsToSearch.slice(0, 25);
        
        setIsSearchingBatch(true);
        setBatchResults(trimmedList.map(c => ({
            cnpj: c,
            loading: true
        })));

        addToast(`Iniciando busca em lote para ${trimmedList.length} CNPJs...`, 'info');

        for (let i = 0; i < trimmedList.length; i++) {
            const currentCnpj = trimmedList[i];

            try {
                const response = await fetch(`/api/cnpj?cnpj=${currentCnpj}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Não cadastrado ou não retornado pelas bases.');
                }
                
                const dataResult: CnpjData = await response.json();
                const matchedUnit = checkIfOurUnit(dataResult);

                setBatchResults(prev => prev.map(item => 
                    item.cnpj === currentCnpj 
                        ? { ...item, loading: false, data: dataResult, matchedUnit } 
                        : item
                ));
            } catch (err: any) {
                setBatchResults(prev => prev.map(item => 
                    item.cnpj === currentCnpj 
                        ? { ...item, loading: false, error: err.message || 'Erro de rede ou consulta falhou' } 
                        : item
                ));
            }

            // Small progressive timeout to respect rate-limiting
            await new Promise(resolve => setTimeout(resolve, 350));
        }

        setIsSearchingBatch(false);
        addToast('Busca em lote concluída com sucesso!', 'success');
    };

    // Filter batch results
    const filteredBatchResults = useMemo(() => {
        return batchResults.filter(item => {
            // Text Filter (CNPJ, Razão Social, Fantasia, Cidade, UF)
            const textLower = batchFilterText.toLowerCase();
            const formattedCnpj = formatCnpj(item.cnpj);
            const matchesText = 
                item.cnpj.includes(batchFilterText) || 
                formattedCnpj.includes(batchFilterText) ||
                (item.data?.razao_social && item.data.razao_social.toLowerCase().includes(textLower)) ||
                (item.data?.nome_fantasia && item.data.nome_fantasia.toLowerCase().includes(textLower)) ||
                (item.data?.municipio && item.data.municipio.toLowerCase().includes(textLower)) ||
                (item.data?.uf && item.data.uf.toLowerCase().includes(textLower)) ||
                (item.matchedUnit?.name && item.matchedUnit.name.toLowerCase().includes(textLower)) ||
                (item.error && item.error.toLowerCase().includes(textLower));

            if (!matchesText) return false;

            // Type Filter
            if (batchFilterType === 'matched') return !!item.matchedUnit;
            if (batchFilterType === 'unmatched') return !item.loading && !item.error && !item.matchedUnit;
            if (batchFilterType === 'error') return !!item.error;
            return true;
        });
    }, [batchResults, batchFilterText, batchFilterType]);

    // Batch statistics
    const batchStats = useMemo(() => {
        const total = batchResults.length;
        const loadingCount = batchResults.filter(i => i.loading).length;
        const successCount = batchResults.filter(i => !i.loading && !i.error).length;
        const errorCount = batchResults.filter(i => !i.loading && i.error).length;
        const matchedCount = batchResults.filter(i => !!i.matchedUnit).length;

        return { total, loadingCount, successCount, errorCount, matchedCount };
    }, [batchResults]);

    // Copy batch matching summary text
    const copyBatchSummaryText = () => {
        if (batchResults.length === 0) return;
        
        let report = `REPOSITÓRIO DE CORRESPONDÊNCIA CNPJ EM LOTE (FINHERO)\n`;
        report += `Data da Consulta: ${new Date().toLocaleString('pt-BR')}\n`;
        report += `Total Consultas: ${batchStats.total} | Unidades Identificadas: ${batchStats.matchedCount}\n\n`;
        
        batchResults.forEach((item, index) => {
            const status = item.loading 
                ? 'Em processamento...' 
                : item.error 
                    ? `Falha: ${item.error}` 
                    : item.matchedUnit 
                        ? `MATCH ENCONTRADO -> Unidade: ${item.matchedUnit.name} (${item.matchedUnit.hasRoom ? 'IE Elegível' : 'Apenas Fiscal'})` 
                        : 'Sem correspondência FinHero';
                        
            const companyName = item.data ? ` - ${item.data.razao_social}` : '';
            report += `${index + 1}. CNPJ: ${formatCnpj(item.cnpj)}${companyName}\n   Resultado: ${status}\n`;
            if (item.data) {
                report += `   Endereço: ${item.data.logradouro}, ${item.data.numero} - ${item.data.municipio}/${item.data.uf} [CEP: ${item.data.cep}]\n`;
            }
            report += `-----------------------------------------------\n`;
        });

        navigator.clipboard.writeText(report)
            .then(() => addToast('Resumo copiado com sucesso!', 'success'))
            .catch(() => addToast('Erro ao copiar dados para a área de transferência.', 'error'));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-1 md:px-0 pb-16">
            
            {/* Header branding */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {t('cnpj.title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Busque e verifique múltiplos endereços cadastrados de clientes integrando diretamente com bases oficiais.
                </p>
            </div>

            {/* Toggle Modes with Modern pill tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/30 rounded-2xl max-w-xs md:max-w-sm">
                <button
                    onClick={() => setSearchMode('individual')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                        searchMode === 'individual'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold'
                    }`}
                >
                    <Building2 size={14} className={searchMode === 'individual' ? 'text-brand-pink animate-pulse' : ''} />
                    Individual
                </button>
                <button
                    onClick={() => setSearchMode('lote')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                        searchMode === 'lote'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold'
                    }`}
                >
                    <Layers size={14} className={searchMode === 'lote' ? 'text-brand-pink animate-pulse' : ''} />
                    Pesquisar em Lote
                </button>
            </div>

            {/* MAIN INDIVIDUAL TAB */}
            {searchMode === 'individual' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-hero border border-slate-100 dark:border-slate-800 space-y-6">
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
                            title="Buscar dados"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search size={22} />
                            )}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={buscarCNPJ}
                            disabled={loading || cnpj.length < 14}
                            className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-md shadow-hero hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50"
                        >
                            {loading ? t('cnpj.searching') : t('cnpj.button')}
                        </button>
                        {data && (
                            <button
                                onClick={() => {
                                    setCnpj('');
                                    setData(null);
                                }}
                                className="px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:text-rose-500 transition-all"
                                title="Limpar resultados"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>

                    {data && (
                        <div className="mt-8 space-y-6 animate-fade-in pt-8 border-t border-slate-100 dark:border-slate-800">
                            
                            {/* Check Correspondence Match */}
                            {isOurUnit ? (
                                <div className="flex items-start md:items-center gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 dark:text-emerald-400">{t('cnpj.our_address')}</h4>
                                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-500/80">
                                            Este endereço coincide com o da unidade oficial: <span className="font-black underline decoration-2 underline-offset-4">{isOurUnit.name}</span>
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${isOurUnit.hasRoom ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                                {isOurUnit.hasRoom ? t('cnpj.room_yes') : t('cnpj.room_no')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/80">
                                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-350">Sem Correspondência Oficial FinHero</h4>
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                            O endereço cadastrado para esta empresa não corresponde a nenhuma das salas ou endereços fiscais do nosso catálogo de unidades.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Status and Porte bar */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${data.descricao_situacao_cadastral === 'ATIVA' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div className="flex flex-col animate-fade-in">
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

                            {/* Information Grid layout */}
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
            )}

            {/* BATCH LOOKUP TAB */}
            {searchMode === 'lote' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-hero border border-slate-100 dark:border-slate-800 space-y-6">
                        
                        {/* Help Guide Banner */}
                        <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-amber-850 dark:text-amber-400 leading-relaxed font-semibold flex items-start gap-2.5">
                            <Info size={16} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                            <div>
                                <p className="font-bold mb-1">Dica de Utilização:</p>
                                Cole uma lista ou qualquer texto contendo múltiplos CNPJs. Esticamos e analisamos o texto para encontrar quaisquer sequências válidas de 14 dígitos (com ou sem caracteres de máscara como pontos, traços ou barras).
                            </div>
                        </div>

                        {/* Textarea container */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    Insira os CNPJs para Verificação
                                </label>
                                <span className="font-mono text-xs text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                    {detectedCnpjs.length} {detectedCnpjs.length === 1 ? 'CNPJ detectado' : 'CNPJs detectados'}
                                </span>
                            </div>

                            <textarea
                                value={batchInput}
                                onChange={(e) => setBatchInput(e.target.value)}
                                placeholder="Exemplo:&#10;12.345.678/0001-99&#10;98.765.432/0001-11, 45.432.123/0001-22"
                                rows={6}
                                disabled={isSearchingBatch}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 font-mono text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-pink dark:focus:border-brand-pink outline-none transition-all resize-y"
                            />
                        </div>

                        {/* Action Buttons for Batch */}
                        <div className="flex gap-2">
                            <button
                                onClick={buscarCnpjsEmLote}
                                disabled={isSearchingBatch || detectedCnpjs.length === 0}
                                className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-md shadow-hero hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSearchingBatch ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Processando Lote ({batchResults.filter(r => !r.loading).length} / {batchResults.length})...
                                    </>
                                ) : (
                                    <>
                                        <Layers size={18} />
                                        Executar Busca em Lote ({detectedCnpjs.length})
                                    </>
                                )}
                            </button>
                            {(batchResults.length > 0 || batchInput.length > 0) && (
                                <button
                                    onClick={() => {
                                        setBatchInput('');
                                        setBatchResults([]);
                                    }}
                                    disabled={isSearchingBatch}
                                    className="px-5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all disabled:opacity-50"
                                    title="Limpar tudo e resetar"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>

                        {/* Active Batch Loading Progress Bar */}
                        {isSearchingBatch && (
                            <div className="space-y-2 animate-fade-in bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                                    <span>Verificando base de dados nacional...</span>
                                    <span className="font-mono">{Math.round((batchResults.filter(r => !r.loading).length / batchResults.length) * 100)}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-pink transition-all duration-300 rounded-full shadow-glow"
                                        style={{ width: `${(batchResults.filter(r => !r.loading).length / batchResults.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BATCH QUERY RESULTS AREA */}
                    {batchResults.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-hero border border-slate-100 dark:border-slate-800 space-y-6 animate-fade-in">
                            
                            {/* Dynamic Stat Widgets */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Inserido</span>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{batchStats.total}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Unidades FinHero</span>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{batchStats.matchedCount}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Sucessos Gerais</span>
                                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{batchStats.successCount}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">Inativos/Erros</span>
                                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{batchStats.errorCount}</p>
                                </div>
                            </div>

                            {/* Batch Control Toolbar & Filter */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto">
                                    <button
                                        onClick={() => setBatchFilterType('all')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            batchFilterType === 'all'
                                                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                                        }`}
                                    >
                                        Todos ({batchStats.total})
                                    </button>
                                    <button
                                        onClick={() => setBatchFilterType('matched')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                            batchFilterType === 'matched'
                                                ? 'bg-emerald-500 text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                                        }`}
                                    >
                                        Matches ({batchStats.matchedCount})
                                    </button>
                                    <button
                                        onClick={() => setBatchFilterType('unmatched')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                            batchFilterType === 'unmatched'
                                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                                        }`}
                                    >
                                        Não matches ({batchStats.successCount - batchStats.matchedCount})
                                    </button>
                                    <button
                                        onClick={() => setBatchFilterType('error')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                            batchFilterType === 'error'
                                                ? 'bg-rose-500 text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                                        }`}
                                    >
                                        Erros ({batchStats.errorCount})
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <div className="relative flex-1 md:w-64">
                                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={batchFilterText}
                                            onChange={(e) => setBatchFilterText(e.target.value)}
                                            placeholder="Filtrar resultados..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-brand-pink"
                                        />
                                        {batchFilterText && (
                                            <button 
                                                onClick={() => setBatchFilterText('')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={copyBatchSummaryText}
                                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shrink-0"
                                        title="Copiar relatório completo"
                                    >
                                        <Copy size={14} />
                                        Copiar Resumo
                                    </button>
                                </div>
                            </div>

                            {/* Batch Results Table / Grid list */}
                            {filteredBatchResults.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                    <HelpCircle size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        Nenhum registro corresponde aos filtros selecionados.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-hidden border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm bg-slate-50/50 dark:bg-slate-950/20">
                                    
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100/40 dark:bg-slate-900/35">
                                                    <th className="py-4 px-5">CNPJ</th>
                                                    <th className="py-4 px-5">Razão Social / Fantasia</th>
                                                    <th className="py-4 px-4 text-center">Status</th>
                                                    <th className="py-4 px-5">Correspondência Unidade</th>
                                                    <th className="py-4 px-4 text-right">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {filteredBatchResults.map((item) => (
                                                    <tr 
                                                        key={item.cnpj} 
                                                        onClick={() => {
                                                            if (!item.loading && !item.error) {
                                                                setSelectedCompany({
                                                                    cnpj: item.cnpj,
                                                                    data: item.data,
                                                                    matchedUnit: item.matchedUnit
                                                                });
                                                            }
                                                        }}
                                                        className={`hover:bg-slate-100/60 dark:hover:bg-slate-800/25 transition-all text-xs cursor-pointer ${item.error ? 'bg-rose-50/20 dark:bg-rose-950/5' : ''}`}
                                                    >
                                                        {/* CNPJ */}
                                                        <td className="py-3.5 px-5 font-mono font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                            {formatCnpj(item.cnpj)}
                                                        </td>

                                                        {/* Trade/Razao Social */}
                                                        <td className="py-3.5 px-5 select-text">
                                                            {item.loading ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-4 h-4 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin shrink-0" />
                                                                    <span className="text-slate-400 font-medium">Buscando...</span>
                                                                </div>
                                                            ) : item.error ? (
                                                                <div className="flex items-center gap-1.5 text-rose-500 font-bold max-w-xs truncate">
                                                                    <AlertCircle size={12} className="shrink-0" />
                                                                    <span>{item.error}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col max-w-xs md:max-w-md">
                                                                    <span className="font-bold text-slate-900 dark:text-white truncate" title={item.data?.razao_social}>
                                                                        {item.data?.razao_social}
                                                                    </span>
                                                                    {item.data?.nome_fantasia && item.data.nome_fantasia !== item.data.razao_social && (
                                                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate" title={item.data.nome_fantasia}>
                                                                            {item.data.nome_fantasia}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* STATUS DESCRIÇÃO */}
                                                        <td className="py-3.5 px-4 text-center">
                                                            {item.data ? (
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                    item.data.descricao_situacao_cadastral === 'ATIVA' 
                                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' 
                                                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                                                                }`}>
                                                                    {item.data.descricao_situacao_cadastral}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold">-</span>
                                                            )}
                                                        </td>

                                                        {/* FINHERO MATCH MATCHED UNIT */}
                                                        <td className="py-3.5 px-5">
                                                            {item.loading ? (
                                                                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                                            ) : item.matchedUnit ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide bg-emerald-500 text-white shadow-glow">
                                                                        <Check size={10} strokeWidth={3} />
                                                                        Match: {item.matchedUnit.name}
                                                                    </span>
                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.matchedUnit.hasRoom ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' : 'bg-slate-200 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400'}`}>
                                                                        {item.matchedUnit.hasRoom ? 'SALA COM IE' : 'APENAS FISCAL'}
                                                                    </span>
                                                                </div>
                                                            ) : item.error ? (
                                                                <span className="text-slate-300 font-medium">-</span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/50 dark:bg-slate-800/40 text-slate-400">
                                                                    Sem correspondência
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* ACTION */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <button 
                                                                disabled={item.loading || !!item.error}
                                                                className={`p-1.5 rounded-lg text-slate-400 hover:text-brand-pink dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/70 transition-all ${item.loading || item.error ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                                title="Visualizar ficha de detalhes"
                                                            >
                                                                <Eye size={15} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards View */}
                                    <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredBatchResults.map((item) => (
                                            <div 
                                                key={item.cnpj}
                                                onClick={() => {
                                                    if (!item.loading && !item.error) {
                                                        setSelectedCompany({
                                                            cnpj: item.cnpj,
                                                            data: item.data,
                                                            matchedUnit: item.matchedUnit
                                                        });
                                                    }
                                                }}
                                                className={`p-4 space-y-3 active:bg-slate-100/50 dark:active:bg-slate-800/50 transition-all ${item.error ? 'bg-rose-50/10' : ''}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-mono font-black text-slate-800 dark:text-slate-200">
                                                        {formatCnpj(item.cnpj)}
                                                    </span>
                                                    {item.data && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                                                            item.data.descricao_situacao_cadastral === 'ATIVA' 
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40' 
                                                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40'
                                                        }`}>
                                                            {item.data.descricao_situacao_cadastral}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    {item.loading ? (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <div className="w-3.5 h-3.5 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin shrink-0" />
                                                            <span>Consultando...</span>
                                                        </div>
                                                    ) : item.error ? (
                                                        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            {item.error}
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">{item.data?.razao_social}</p>
                                                            {item.data?.nome_fantasia && item.data.nome_fantasia !== item.data.razao_social && (
                                                                <p className="text-[10px] font-medium text-slate-400 line-clamp-1">{item.data.nome_fantasia}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {!item.loading && !item.error && (
                                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/40 text-[10px]">
                                                        <div>
                                                            {item.matchedUnit ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black bg-emerald-500 text-white text-[8.5px] uppercase tracking-wider">
                                                                    Match: {item.matchedUnit.name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 font-bold">Sem correspondência</span>
                                                            )}
                                                        </div>
                                                        <span className="text-slate-400 hover:text-brand-pink flex items-center gap-1 font-bold">
                                                            Ver detalhes <Eye size={12} />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* DETAILED OVERLAY POPUP */}
            {selectedCompany && selectedCompany.data && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Elegant Header */}
                        <div className="bg-brand-pink text-white p-6 relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl animate-pulse" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-white/20 uppercase tracking-widest text-white leading-none font-sans">
                                            {selectedCompany.cnpj ? formatCnpj(selectedCompany.cnpj) : 'CNPJ'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest leading-none ${
                                            selectedCompany.data.descricao_situacao_cadastral === 'ATIVA' 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-rose-505 text-white'
                                        }`}>
                                            {selectedCompany.data.descricao_situacao_cadastral}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black font-sans uppercase tracking-tight leading-tight mt-1 max-w-sm line-clamp-2" title={selectedCompany.data.razao_social}>
                                        {selectedCompany.data.razao_social}
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => setSelectedCompany(null)}
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all outline-none"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Core details view (Privileged data privacy compliant) */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            
                            {/* MATCH HIGHLIGHT BANNER */}
                            {selectedCompany.matchedUnit ? (
                                <div className="px-4 py-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex gap-3 text-xs leading-relaxed">
                                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-black text-emerald-950 dark:text-emerald-400">Match de Unidade Oficial</p>
                                        <p className="font-semibold text-emerald-800 dark:text-emerald-500/80 mt-0.5">
                                            Este endereço pertence a nossa unidade oficial de correspondência: <strong className="font-black underline">{selectedCompany.matchedUnit.name}</strong>.
                                        </p>
                                        <p className="font-bold text-slate-500 dark:text-slate-400 mt-1">
                                            Inscrição Estadual: <strong className="font-black text-slate-800 dark:text-slate-350">{selectedCompany.matchedUnit.hasRoom ? 'Habilitada (Possui Sala)' : 'Apenas para fins de Endereço Fiscal'}</strong>.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex gap-3 text-xs leading-relaxed">
                                    <HelpCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-slate-350">Sem Correspondência Hero</p>
                                        <p className="font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                            Este endereço não coincide com nossos endereços cadastrados.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Informações Gerais Panel */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                                    <Info size={14} className="text-brand-pink" />
                                    Informações Gerais
                                </h4>
                                
                                <div className="space-y-4 text-xs leading-relaxed">
                                    {/* Endereço */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-1">
                                        <span className="font-semibold text-slate-400">Endereço:</span>
                                        <span className="md:col-span-2 font-bold text-slate-900 dark:text-slate-100">
                                            {selectedCompany.data.logradouro}, {selectedCompany.data.numero} {selectedCompany.data.complemento ? selectedCompany.data.complemento : ''} | {selectedCompany.data.bairro}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-1 border-t border-slate-50 dark:border-slate-850/50 pt-3">
                                        <span className="font-semibold text-slate-400">CEP:</span>
                                        <span className="md:col-span-2 font-bold text-slate-900 dark:text-slate-100 font-mono">
                                            {selectedCompany.data.cep || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-1 border-t border-slate-50 dark:border-slate-850/50 pt-3">
                                        <span className="font-semibold text-slate-400">Inscrição Estadual (IE):</span>
                                        <span className="md:col-span-2">
                                            {selectedCompany.matchedUnit ? (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black inline-block ${
                                                    selectedCompany.matchedUnit.hasRoom 
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' 
                                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                                }`}>
                                                    {selectedCompany.matchedUnit.hasRoom ? 'Habilitada (Possui Sala)' : 'Não elegível (Apenas Fiscal)'}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-450 inline-block">
                                                    Não elegível ou Não cadastrado
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer styling */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex justify-end shrink-0 gap-2">
                            <button 
                                onClick={() => setSelectedCompany(null)}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                            >
                                Fechar
                            </button>
                            <button 
                                onClick={() => {
                                    const textToCopy = `Empresa: ${selectedCompany?.data?.razao_social}\nCNPJ: ${formatCnpj(selectedCompany?.cnpj || '')}\nEndereço: ${selectedCompany?.data?.logradouro}, ${selectedCompany?.data?.numero} - CEP: ${selectedCompany?.data?.cep}`;
                                    navigator.clipboard.writeText(textToCopy);
                                    addToast('Dossiê do endereço copiado!', 'success');
                                }}
                                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black font-sans uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1.5"
                            >
                                <Copy size={12} />
                                Copiar Dossiê
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
