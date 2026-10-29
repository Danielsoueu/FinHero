import React, { useState } from 'react';
import { 
    TrendingUp, 
    Percent, 
    XCircle, 
    FileText, 
    Handshake, 
    ArrowRight, 
    HelpCircle, 
    MessageSquare,
    Ticket,
    Search,
    MapPin,
    Users
} from 'lucide-react';
import { TabId } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
    onNavigate: (tab: TabId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const { isAdmin } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const apps = [
        {
            id: TabId.JUROS,
            label: t('dashboard.apps.juros_label'),
            desc: t('dashboard.apps.juros_desc'),
            color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
            icon: <TrendingUp size={24} />
        },
        {
            id: TabId.PORCENTAGEM,
            label: t('dashboard.apps.porc_label'),
            desc: t('dashboard.apps.porc_desc'),
            color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
            icon: <Percent size={24} />
        },
        {
            id: TabId.CANCELAMENTO,
            label: t('dashboard.apps.cancel_label'),
            desc: t('dashboard.apps.cancel_desc'),
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
            icon: <XCircle size={24} />
        },
        {
            id: TabId.PAGAMENTO,
            label: t('dashboard.apps.pag_label'),
            desc: t('dashboard.apps.pag_desc'),
            color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
            icon: <FileText size={24} />
        },
        {
            id: TabId.NEGOCIACAO,
            label: t('dashboard.apps.neg_label'),
            desc: t('dashboard.apps.neg_desc'),
            color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
            icon: <Handshake size={24} />
        },
        {
            id: TabId.CUPONS,
            label: t('dashboard.apps.cupons_label'),
            desc: t('dashboard.apps.cupons_desc'),
            color: 'text-brand-pink bg-brand-pink/5 dark:bg-brand-pink/10',
            icon: <Ticket size={24} />
        },
        {
            id: TabId.CNPJ,
            label: t('dashboard.apps.cnpj_label'),
            desc: t('dashboard.apps.cnpj_desc'),
            color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10',
            icon: <Search size={24} />
        },
        {
            id: TabId.ENDERECOS,
            label: t('dashboard.apps.enderecos_label'),
            desc: t('dashboard.apps.enderecos_desc'),
            color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
            icon: <MapPin size={24} />
        },
        ...(isAdmin ? [{
            id: TabId.USUARIOS,
            label: t('dashboard.apps.usuarios_label'),
            desc: t('dashboard.apps.usuarios_desc'),
            color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
            icon: <Users size={24} />
        }] : [])
    ];

    const filteredApps = apps.filter((app) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            app.label.toLowerCase().includes(q) ||
            app.desc.toLowerCase().includes(q)
        );
    });

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in">
            {/* Header: Title and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <span>{t('dashboard.title')}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                            {filteredApps.length} {filteredApps.length === 1 ? 'ferramenta' : 'ferramentas'}
                        </span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('dashboard.subtitle')}
                    </p>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar ferramenta..."
                        className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all shadow-xs"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            title="Limpar busca"
                        >
                            <XCircle size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Reset pill when query active */}
            {searchQuery && (
                <div className="flex items-center justify-between text-xs text-slate-500 -mt-2">
                    <span>
                        Filtrando por &ldquo;<strong className="text-slate-800 dark:text-slate-200">{searchQuery}</strong>&rdquo; ({filteredApps.length} de {apps.length})
                    </span>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-bold text-brand-pink hover:text-brand-hover dark:text-pink-400 transition-colors"
                    >
                        Limpar filtro
                    </button>
                </div>
            )}

            {/* Grid Area */}
            {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => onNavigate(app.id)}
                            className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-pink/40 dark:hover:border-brand-pink/40 transition-all duration-200 text-left hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between w-full mb-6">
                                <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-xs`}>
                                    {app.icon}
                                </div>
                                <ArrowRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-brand-pink group-hover:translate-x-1 transition-all" />
                            </div>
                            
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-brand-pink transition-colors">
                                {app.label}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {app.desc}
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Nenhuma ferramenta encontrada para &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-bold text-brand-pink hover:underline"
                    >
                        Ver todas as ferramentas
                    </button>
                </div>
            )}

            {/* Footer Area */}
            <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs font-semibold">
                        <HelpCircle size={14} />
                        {t('dashboard.footer_help')}
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs font-semibold">
                        <MessageSquare size={14} />
                        {t('dashboard.footer_support')}
                    </button>
                </div>
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    FinHero • 2026
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
