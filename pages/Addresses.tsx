import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Globe, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { units, Unit } from '../constants/units';

const Addresses: React.FC = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUnits = useMemo(() => {
        if (!searchTerm) return units;
        const lowerSearch = searchTerm.toLowerCase();
        return units.filter(unit => 
            unit.name.toLowerCase().includes(lowerSearch) || 
            unit.address.toLowerCase().includes(lowerSearch) || 
            unit.region.toLowerCase().includes(lowerSearch) ||
            (unit.cep && unit.cep.includes(lowerSearch))
        );
    }, [searchTerm]);

    const groupedUnits = useMemo(() => {
        const groups: { [key: string]: Unit[] } = {};
        filteredUnits.forEach(unit => {
            if (!groups[unit.region]) {
                groups[unit.region] = [];
            }
            groups[unit.region].push(unit);
        });
        return groups;
    }, [filteredUnits]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t('enderecos.title')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {t('enderecos.subtitle')}
                    </p>
                </div>
                <div className="relative w-full md:w-80">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder={t('enderecos.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-pink dark:focus:border-brand-pink outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {filteredUnits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                         <MapPin size={32} />
                    </div>
                    <p className="text-slate-500 font-bold">{t('enderecos.no_results')}</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.entries(groupedUnits).map(([region, regionUnits]) => (
                        <div key={region} className="space-y-5">
                            <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white pl-1">
                                <span className="w-2 h-6 bg-brand-pink rounded-full"></span>
                                {region}
                            </h3>
                            <div className="flex flex-col gap-2">
                                {(regionUnits as Unit[]).map((unit, idx) => (
                                    <div 
                                        key={idx}
                                        className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand-pink/30 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-pink shrink-0">
                                                <Building2 size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-pink transition-colors truncate">
                                                        {unit.name}
                                                    </h4>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                        unit.type === 'Própria' 
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                            : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                    }`}>
                                                        {unit.type === 'Própria' ? t('enderecos.type_propria') : t('enderecos.type_parceria')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                                                        {unit.address} {unit.cep && <span className="ml-2 font-bold text-slate-400">({unit.cep})</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address + (unit.cep ? ' ' + unit.cep : ''))}`, '_blank')}
                                            className="px-4 py-2 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-pink hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-all shadow-sm"
                                        >
                                            <Navigation size={12} />
                                            {t('common.preview') || 'Ver Mapa'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Addresses;
