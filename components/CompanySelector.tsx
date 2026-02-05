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
                {Object.values(COMPANIES).map((company) => (
                    <button
                        key={company.id}
                        onClick={() => onSelect(company)}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 w-40 group overflow-hidden ${
                            selected?.id === company.id
                                ? 'bg-white dark:bg-slate-800 border-brand-pink shadow-glow ring-1 ring-brand-pink/20'
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                        }`}
                    >
                        {/* Status Indicator */}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-colors duration-300 ${selected?.id === company.id ? 'bg-brand-pink' : 'bg-slate-100 dark:bg-slate-700'}`}></div>

                        {/* Logo Container - Expanded size for horizontal logos */}
                        <div className={`h-12 w-full flex items-center justify-center mb-2 transition-transform duration-300 ${selected?.id === company.id ? 'scale-100' : 'scale-95 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                            {/* Invert logo for Company Hero if it's black text, usually companies have dark/light variants but here we use the same URL. We might need brightness filter for dark mode if logo is black. Assuming standard logos work or need bg. Added bg-white to logo container to ensure visibility in dark mode if logos are transparent pngs with dark text. */}
                             <div className="p-1 bg-white/5 rounded-lg">
                                <img 
                                    src={company.logoUrl} 
                                    alt={company.nome} 
                                    className="h-full w-full object-contain"
                                />
                             </div>
                        </div>
                        
                        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${selected?.id === company.id ? 'text-brand-dark dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            {company.id === 'empresaA' ? 'MEV' : 'Company Hero'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CompanySelector;