import React, { useState, useMemo } from 'react';
import { 
    Search, MapPin, Building2, Globe, Navigation, Filter, 
    Layers, CheckCircle2, ChevronRight, X, AlertTriangle, 
    Calendar, ShieldCheck, DollarSign, ListTodo, Info, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { units, Unit } from '../constants/units';

const Addresses: React.FC = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'Própria' | 'Parceria'>('all');
    const [filterRoom, setFilterRoom] = useState<'all' | 'yes' | 'no'>('all');
    const [filterRegion, setFilterRegion] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'Ativo' | 'Desativada'>('all');
    
    // modal view state
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const regions = useMemo(() => {
        const uniqueRegions = Array.from(new Set(units.map(u => u.region)));
        return uniqueRegions.sort();
    }, []);

    // State stats
    const stateCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        units.forEach(u => {
            if (u.status === 'Ativo') {
                counts[u.state] = (counts[u.state] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([state, count]) => ({ state, count }))
            .sort((a, b) => b.count - a.count);
    }, []);

    // Filter logic
    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchesSearch = !searchTerm || (
                unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                unit.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                unit.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                unit.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (unit.cep && unit.cep.includes(searchTerm))
            );

            const matchesType = filterType === 'all' || unit.type === filterType;
            const matchesRoom = filterRoom === 'all' || (filterRoom === 'yes' ? unit.hasRoom : !unit.hasRoom);
            const matchesRegion = filterRegion === 'all' || unit.region === filterRegion;
            const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;

            return matchesSearch && matchesType && matchesRoom && matchesRegion && matchesStatus;
        });
    }, [searchTerm, filterType, filterRoom, filterRegion, filterStatus]);

    // Grouping for rendering
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

    // Statistics cards
    const stats = useMemo(() => {
        const activeUnits = units.filter(u => u.status === 'Ativo');
        const proprias = activeUnits.filter(u => u.type === 'Própria').length;
        const parcerias = activeUnits.filter(u => u.type === 'Parceria').length;
        const permitsIe = activeUnits.filter(u => u.hasRoom).length;
        const uniqueStates = new Set(activeUnits.map(u => u.state)).size;

        return {
            total: activeUnits.length,
            proprias,
            parcerias,
            permitsIe,
            states: uniqueStates
        };
    }, []);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Header section with brand colors */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-brand-pink text-white rounded-full">
                            Rede Oficial
                        </span>
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-slate-100 rounded-full dark:bg-slate-800">
                            Padrão de Coexistência
                        </span>
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                        Addresses & <span className="text-brand-pink">Unidades</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl text-sm leading-relaxed">
                        Consulte o portfólio completo da Company Hero. Visualize as fichas técnicas de cada sala comercial, verifique a viabilidade de Inscrição Estadual (IE) e acompanhe a cobertura nacional.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar unidade, CEP, endereço..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-pink dark:focus:border-brand-pink outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filter and Content section layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                {/* Advanced filter panels / State List inside sidebar column */}
                <div className="space-y-6 lg:sticky lg:top-8">
                    {/* Advanced filter panel */}
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-brand-pink" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white font-sans">Filtragem Rápida</h4>
                            </div>
                            {(filterType !== 'all' || filterRoom !== 'all' || filterRegion !== 'all' || filterStatus !== 'all' || searchTerm !== '') && (
                                <button 
                                    onClick={() => {
                                        setFilterType('all');
                                        setFilterRoom('all');
                                        setFilterRegion('all');
                                        setFilterStatus('all');
                                        setSearchTerm('');
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-brand-pink hover:underline"
                                >
                                    Resetar
                                </button>
                            )}
                        </div>

                        {/* Search status filter */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Status Comercial</label>
                            <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                {[
                                    { id: 'all', label: 'Todos' },
                                    { id: 'Ativo', label: 'Ativos' },
                                    { id: 'Desativada', label: 'Desat.' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFilterStatus(opt.id as any)}
                                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            filterStatus === opt.id 
                                                ? 'bg-brand-pink text-white shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Format type selection */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Tipo de Operação</label>
                            <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                {[
                                    { id: 'all', label: 'Todas' },
                                    { id: 'Própria', label: 'Próprias' },
                                    { id: 'Parceria', label: 'Parcerias' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFilterType(opt.id as any)}
                                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            filterType === opt.id 
                                                ? 'bg-brand-pink text-white shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* IE Eligibility selection */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Inscrição Estadual (IE)</label>
                            <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                {[
                                    { id: 'all', label: 'Todos' },
                                    { id: 'yes', label: 'Sim (Sala)' },
                                    { id: 'no', label: 'Não' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setFilterRoom(opt.id as any)}
                                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            filterRoom === opt.id 
                                                ? 'bg-amber-500 text-white shadow-sm' 
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Region selector dropdown */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1 font-sans">Região</label>
                            <div className="relative">
                                <select
                                    value={filterRegion}
                                    onChange={(e) => setFilterRegion(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none focus:border-brand-pink transition-all appearance-none cursor-pointer pr-10"
                                >
                                    <option value="all">Todas as Regiões</option>
                                    {regions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Globe size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Content Grid */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* Filter count indicator badge */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 font-sans">
                            Mostrando {filteredUnits.length} de {units.length} unidades encontradas
                        </p>
                    </div>

                    {filteredUnits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-850">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                                 <MapPin size={32} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">Nenhuma unidade corresponde aos filtros ativos.</p>
                            <p className="text-slate-400 text-xs">Tente redefinir a pesquisa para ver mais unidades.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {Object.entries(groupedUnits).map(([region, regionUnits]) => (
                                <div key={region} className="space-y-5">
                                    
                                    {/* Region Title Card */}
                                    <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white pl-1 font-sans">
                                        <span className="w-2.5 h-6 bg-brand-pink rounded-full"></span>
                                        {region}
                                    </h3>
                                    
                                    {/* Core List of Units */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(regionUnits as Unit[]).map((unit, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => setSelectedUnit(unit)}
                                                className="group p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850/80 shadow-sm hover:border-brand-pink hover:shadow-glow transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="space-y-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-brand-pink font-sans transition-colors truncate">
                                                                    {unit.name}
                                                                </h4>
                                                                
                                                                {/* Status designation */}
                                                                {unit.status !== 'Ativo' && (
                                                                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded border border-slate-200 dark:border-slate-800">
                                                                        {unit.status}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">
                                                                UF: {unit.state} • Lançamento: {unit.launchYear}
                                                            </p>
                                                        </div>
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                                            unit.type === 'Própria'
                                                                ? 'bg-rose-50 text-brand-pink dark:bg-rose-500/15'
                                                                : 'bg-blue-50 text-blue-600 dark:bg-blue-500/15'
                                                        }`}>
                                                            <Building2 size={16} />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={12} className="text-slate-400 shrink-0" />
                                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                                                            {unit.address}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/80 mt-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                                            unit.type === 'Própria' 
                                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-550/10' 
                                                                : 'bg-blue-50 text-blue-600 dark:bg-blue-550/10'
                                                        }`}>
                                                            {unit.type === 'Própria' ? 'Own / Própria' : 'Partner / Parceira'}
                                                        </span>
                                                        
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                                                            unit.hasRoom
                                                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                                                : 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                                                        }`}>
                                                            {unit.hasRoom ? 'SALA (IE)' : 'APENAS FISCAL'}
                                                        </span>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address + (unit.cep ? ' ' + unit.cep : ''))}`, '_blank');
                                                        }}
                                                        className="p-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-brand-pink hover:text-white rounded-lg text-slate-400 dark:text-slate-400 transition-all border border-slate-100 dark:border-slate-800"
                                                    >
                                                        <Navigation size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* HIGH-FIDELITY Unit Details Overlay (Ficha técnica) */}
            {selectedUnit && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Elegant Header with Electric Rose */}
                        <div className="bg-brand-pink text-white p-6 relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                            <div className="flex items-start justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-white/25 rounded text-[8px] font-black uppercase tracking-widest">
                                            {selectedUnit.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                            selectedUnit.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-800'
                                        }`}>
                                            {selectedUnit.status}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black font-sans uppercase tracking-tight leading-none mt-1">
                                        {selectedUnit.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/80 leading-relaxed font-sans mt-0.5">
                                        {selectedUnit.condo || 'Condomínio ou Edifício Associado'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedUnit(null)}
                                    className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-all outline-none"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Detailed sheets */}
                        <div className="p-8 overflow-y-auto space-y-6">
                            
                            {/* Two Column Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* GENERAL INFORMATION PANEL */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <Info size={14} className="text-brand-pink" />
                                        Informações Gerais
                                    </h4>
                                    
                                    <div className="space-y-3 text-xs leading-relaxed">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-semibold text-slate-400">Endereço:</span>
                                            <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{selectedUnit.address}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-semibold text-slate-400">CEP:</span>
                                            <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100 font-mono">{selectedUnit.cep || 'N/A'}</span>
                                        </div>
                                        {selectedUnit.complement && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">Complemento:</span>
                                                <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{selectedUnit.complement}</span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-semibold text-slate-400">Inscrição Estadual (IE):</span>
                                            <span className="col-span-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                                    selectedUnit.hasRoom 
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' 
                                                        : 'bg-slate-105 text-slate-500 dark:bg-slate-850'
                                                }`}>
                                                    {selectedUnit.hasRoom ? 'Habilitada (Possui Sala)' : 'Não elegível (Apenas Fiscal)'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CONTRACT PARAMETERS */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <Calendar size={14} className="text-blue-500" />
                                        Financeiro e Contrato
                                    </h4>

                                    <div className="space-y-3 text-xs leading-relaxed">
                                        {selectedUnit.contractStart && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">Início:</span>
                                                <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{selectedUnit.contractStart}</span>
                                            </div>
                                        )}
                                        {selectedUnit.gracePeriod && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">Carência:</span>
                                                <span className="col-span-2 font-bold text-slate-500">{selectedUnit.gracePeriod}</span>
                                            </div>
                                        )}
                                        {selectedUnit.rent && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">Valor Aluguel:</span>
                                                <span className="col-span-2 font-black text-brand-pink font-mono">{selectedUnit.rent}</span>
                                            </div>
                                        )}
                                        {selectedUnit.iptu && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">IPTU rate:</span>
                                                <span className="col-span-2 font-bold text-slate-500 font-mono">{selectedUnit.iptu}</span>
                                            </div>
                                        )}
                                        {selectedUnit.insurance && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="font-semibold text-slate-400">Seguro Incêndio:</span>
                                                <span className="col-span-2 text-slate-900 dark:text-slate-100">
                                                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 font-black text-[9px] uppercase tracking-wider">
                                                        Contratado
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* OPERATIONAL PARAMETERS AND CHECKLIST */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                
                                {/* OPERATIONAL CHECKLIST */}
                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                                        <ListTodo size={14} className="text-emerald-500" />
                                        Status Operational Checklist
                                    </h4>
                                    
                                    <div className="space-y-2.5">
                                        {[
                                            { task: 'Abrir estrutura cadastral da pasta', resp: 'BackOffice', done: true },
                                            { task: 'Inserir versão do contrato no drive', resp: 'BackOffice', done: true },
                                            { task: 'Assinatura digital válida do contrato', resp: 'Liderança', done: true },
                                            { task: 'Cadastro financeiro para repasse/faturas', resp: 'Faturamento', done: selectedUnit.status === 'Ativo' },
                                            { task: 'Verificação física na prefeitura e IPTUs', resp: 'Operações', done: selectedUnit.hasRoom }
                                        ].map((todo, idx) => (
                                            <div key={idx} className="flex items-start justify-between text-[11px] gap-2">
                                                <div className="flex gap-2 items-start">
                                                    {todo.done ? (
                                                        <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                                    ) : (
                                                        <div className="w-3 h-3 rounded-full border-2 border-slate-300 mt-0.5 shrink-0" />
                                                    )}
                                                    <span className={`font-semibold ${todo.done ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                                                        {todo.task}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-[9px] text-slate-400 font-bold shrink-0">{todo.resp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RULES AND CAUTIONS */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-brand-pink" />
                                        Instruções de Correspondência
                                    </h4>
                                    <div className="p-4 bg-brand-pink/5 border border-brand-pink/10 rounded-2xl space-y-2">
                                        <div className="flex gap-2 items-start">
                                            <AlertTriangle size={14} className="text-brand-pink mt-0.5 shrink-0" />
                                            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {selectedUnit.mailboxRequired 
                                                    ? 'Obs Importante: Todo cliente nesta unidade exige obrigatoriamente a contratação ou indicação de caixa postal no contrato comercial.'
                                                    : 'Unidade aceita tráfego padrão de correspondência. Notificação ao cliente é disparada sob recebimento.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold italic leading-none pl-1">
                                        <Info size={10} />
                                        Portfólio atualizado de acordo com o Brandbook de 2026.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer action */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex justify-end shrink-0">
                            <button 
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUnit.address + (selectedUnit.cep ? ' ' + selectedUnit.cep : ''))}`, '_blank')}
                                className="px-5 py-2.5 bg-brand-pink text-white rounded-xl text-xs font-black font-sans uppercase tracking-widest shadow-glow hover:bg-brand-pink/90 transition-all flex items-center gap-2"
                            >
                                <Navigation size={14} />
                                Abrir Localização Completa no Maps
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addresses;
