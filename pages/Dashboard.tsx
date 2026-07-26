import React from 'react';
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
import Clock from '../components/Clock';
import IuguStatus from '../components/IuguStatus';

interface DashboardProps {
    onNavigate: (tab: TabId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const { isAdmin } = useAuth();

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

    return (
        <div className="flex flex-col h-full space-y-10">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {t('dashboard.title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {t('dashboard.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <IuguStatus />
                    <Clock />
                </div>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => onNavigate(app.id)}
                        className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-pink/30 transition-all duration-200 text-left"
                    >
                        <div className="flex items-start justify-between w-full mb-6">
                            <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                                {app.icon}
                            </div>
                            <ArrowRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-brand-pink transition-colors" />
                        </div>
                        
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-brand-pink transition-colors">{app.label}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
                    </button>
                ))}
            </div>

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
