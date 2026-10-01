import React from 'react';
import { Company } from '../types';
import { COMPANIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface CompanySelectorProps {
    selected: Company | null;
    onSelect: (company: Company) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ selected, onSelect }) => {
    const { t } = useLanguage();
    
    return (
        <div className="mb-8 animate-slide-in">
            <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-2 after:content-[''] after:h-px after:w-8 after:bg-slate-200 dark:after:bg-slate-700 before:content-[''] before:h-px before:w-8 before:bg-slate-200 dark:before:bg-slate-700">
                {t('common.select_company')}
            </h2>
            <div className="flex justify-center gap-4">
                {Object.values(COMPANIES).map((company) => {
                    const isSelected = selected?.id === company.id;
                    const isMev = company.id === 'empresaA';
                    
                    return (
                        <button
                            key={company.id}
                            onClick={() => onSelect(company)}
                            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 w-44 group overflow-hidden ${
                                isSelected
                                    ? isMev 
                                        ? 'bg-white dark:bg-slate-800 border-[#0A20FF] shadow-lg shadow-blue-500/20 ring-2 ring-[#0A20FF]/25'
                                        : 'bg-white dark:bg-slate-800 border-brand-pink shadow-glow ring-2 ring-brand-pink/25'
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                            }`}
                        >
                            {/* Status Indicator */}
                            <div 
                                className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                                    isSelected 
                                        ? isMev ? 'bg-[#0A20FF]' : 'bg-brand-pink'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            />

                            {/* Selected Brand Badge */}
                            {isSelected && (
                                <span 
                                    className={`absolute top-2 left-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${
                                        isMev 
                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0A20FF]' 
                                            : 'bg-pink-50 dark:bg-pink-950/60 text-brand-pink'
                                    }`}
                                >
                                    Ativo
                                </span>
                            )}

                            {/* Logo Container */}
                            <div className={`h-12 w-full flex items-center justify-center mb-2 mt-2 transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-95 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                 <div className="p-1.5 bg-white/10 dark:bg-white/5 rounded-lg max-h-12 flex items-center justify-center">
                                    <img 
                                        src={company.logoUrl} 
                                        alt={company.nome} 
                                        className="h-9 w-auto max-w-[120px] object-contain"
                                    />
                                 </div>
                            </div>
                            
                            <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                                isSelected 
                                    ? isMev ? 'text-[#0A20FF] dark:text-blue-400' : 'text-brand-pink' 
                                    : 'text-slate-400 dark:text-slate-500'
                            }`}>
                                {company.id === 'empresaA' ? 'Meu Escritório Virtual' : 'Company Hero'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CompanySelector;