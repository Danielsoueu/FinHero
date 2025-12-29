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
        <div className="mb-8">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">{t('common.select_company')}</h2>
            <div className="flex justify-center gap-6">
                {Object.values(COMPANIES).map((company) => (
                    <button
                        key={company.id}
                        onClick={() => onSelect(company)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 w-28 group ${
                            selected?.id === company.id
                                ? 'border-brand-pink bg-pink-50/50 shadow-sm'
                                : 'border-slate-100 hover:border-pink-200 hover:bg-white'
                        }`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm p-1 mb-3 transition-transform duration-300 ${selected?.id === company.id ? 'scale-110 ring-2 ring-pink-100' : 'grayscale group-hover:grayscale-0'}`}>
                            <img 
                                src={company.logoUrl} 
                                alt={company.nome} 
                                className="w-full h-full rounded-full object-contain"
                            />
                        </div>
                        <span className={`text-xs font-bold transition-colors ${selected?.id === company.id ? 'text-brand-pink' : 'text-slate-500'}`}>
                            {company.id === 'empresaA' ? 'MEV' : 'Hero'}
                        </span>
                        {selected?.id === company.id && (
                            <div className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-2"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CompanySelector;