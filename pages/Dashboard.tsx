import React from 'react';
import { TabId } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
    onNavigate: (tab: TabId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const apps = [
        {
            id: TabId.JUROS,
            label: t('dashboard.apps.juros_label'),
            desc: t('dashboard.apps.juros_desc'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        },
        {
            id: TabId.PORCENTAGEM,
            label: t('dashboard.apps.porc_label'),
            desc: t('dashboard.apps.porc_desc'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
        },
        {
            id: TabId.CANCELAMENTO,
            label: t('dashboard.apps.cancel_label'),
            desc: t('dashboard.apps.cancel_desc'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        },
        {
            id: TabId.PAGAMENTO,
            label: t('dashboard.apps.pag_label'),
            desc: t('dashboard.apps.pag_desc'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        },
        {
            id: TabId.NEGOCIACAO,
            label: t('dashboard.apps.neg_label'),
            desc: t('dashboard.apps.neg_desc'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="M11 17l-4 4L2 19V5l4-2 3 3 5 5 5-5 3 3v8"/></svg>
        }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header Area */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-dark mb-2">{t('dashboard.title')}</h1>
                <p className="text-slate-500">{t('dashboard.subtitle')}</p>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apps.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => onNavigate(app.id)}
                        className="group flex flex-col p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-glow hover:border-brand-pink/50 transition-all duration-300 text-left relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between w-full mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-brand-pink group-hover:text-white transition-colors duration-300">
                                {app.icon}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                <span className="bg-slate-100 text-slate-600 rounded-full p-1.5 inline-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </span>
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-brand-dark text-lg mb-1 group-hover:text-brand-pink transition-colors">{app.label}</h3>
                        <p className="text-sm text-slate-500 font-medium">{app.desc}</p>
                    </button>
                ))}
            </div>

            {/* Empty State / Bottom filler */}
            <div className="mt-auto pt-10 border-t border-slate-200/60">
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        {t('dashboard.footer_help')}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{t('dashboard.footer_support')}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;