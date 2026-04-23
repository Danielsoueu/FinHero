import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Globe, Navigation, Filter, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { units, Unit } from '../constants/units';

const Addresses: React.FC = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'Própria' | 'Parceria'>('all');
    const [filterRoom, setFilterRoom] = useState<'all' | 'yes' | 'no'>('all');
    const [filterRegion, setFilterRegion] = useState<string>('all');

    const regions = useMemo(() => {
        const uniqueRegions = Array.from(new Set(units.map(u => u.region)));
        return uniqueRegions.sort();
    }, []);

    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchesSearch = !searchTerm || (
                unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                unit.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                unit.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (unit.cep && unit.cep.includes(searchTerm))
            );

            const matchesType = filterType === 'all' || unit.type === filterType;
            const matchesRoom = filterRoom === 'all' || (filterRoom === 'yes' ? unit.hasRoom : !unit.hasRoom);
            const matchesRegion = filterRegion === 'all' || unit.region === filterRegion;

            return matchesSearch && matchesType && matchesRoom && matchesRegion;
        });
    }, [searchTerm, filterType, filterRoom, filterRegion]);

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

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Filter size={18} className="text-brand-pink" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Filtros Avançados</h4>
                    </div>
                    {(filterType !== 'all' || filterRoom !== 'all' || filterRegion !== 'all' || searchTerm !== '') && (
                        <button 
                            onClick={() => {
                                setFilterType('all');
                                setFilterRoom('all');
                                setFilterRegion('all');
                                setSearchTerm('');
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-brand-pink hover:underline"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Tipo de Unidade</label>
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                            {[
                                { id: 'all', label: 'Todas' },
                                { id: 'Própria', label: 'Próprias' },
                                { id: 'Parceria', label: 'Parcerias' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilterType(opt.id as any)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                        filterType === opt.id 
                                            ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Serviço (IE)</label>
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'yes', label: 'Sala (IE)' },
                                { id: 'no', label: 'Fiscal' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilterRoom(opt.id as any)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                        filterRoom === opt.id 
                                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Região</label>
                        <div className="relative">
                            <select
                                value={filterRegion}
                                onChange={(e) => setFilterRegion(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:border-brand-pink transition-all appearance-none cursor-pointer pr-10"
                            >
                                <option value="all">Todas as Regiões</option>
                                {regions.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Globe size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {filteredUnits.length} {filteredUnits.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </span>
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
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                        unit.hasRoom
                                                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50'
                                                            : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                                                    }`}>
                                                        {unit.hasRoom ? 'SALA (IE)' : 'FISCAL'}
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
