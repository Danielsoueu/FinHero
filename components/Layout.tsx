import React from 'react';
import { TabId, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

// Icons optimized
const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Juros: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    Porcentagem: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    Cancelamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    Pagamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
    Negociacao: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="M11 17l-4 4L2 19V5l4-2 3 3 5 5 5-5 3 3v8"/></svg>
};

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    
    const languages: { id: Language; label: string }[] = [
        { id: 'pt', label: 'PT' },
        { id: 'en', label: 'EN' },
        { id: 'es', label: 'ES' }
    ];

    return (
        <div className="flex bg-slate-800/50 rounded-lg p-1 gap-1 border border-slate-700/50">
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all duration-200 ${
                        language === lang.id 
                        ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    const { t } = useLanguage();

    const navItems = [
        { id: TabId.HOME, label: t('sidebar.home'), icon: <Icons.Home /> },
        { id: TabId.JUROS, label: t('sidebar.juros'), icon: <Icons.Juros /> },
        { id: TabId.PORCENTAGEM, label: t('sidebar.porcentagem'), icon: <Icons.Porcentagem /> },
        { id: TabId.CANCELAMENTO, label: t('sidebar.cancelamento'), icon: <Icons.Cancelamento /> },
        { id: TabId.PAGAMENTO, label: t('sidebar.pagamento'), icon: <Icons.Pagamento /> },
        { id: TabId.NEGOCIACAO, label: t('sidebar.negociacao'), icon: <Icons.Negociacao /> },
    ];

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-brand-dark flex-shrink-0 hidden md:flex flex-col relative z-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Brand Area */}
                <div className="p-8 pb-6 relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                         {/* Original Pink Bar Logo Style */}
                         <div className="h-8 w-1.5 bg-brand-pink rounded-full shadow-[0_0_12px_rgba(230,0,126,0.8)]"></div>
                         <h1 className="text-2xl font-bold tracking-tight text-white">FinHero</h1>
                    </div>
                    <LanguageSwitcher />
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 space-y-1 relative z-10 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                                activeTab === item.id
                                    ? 'bg-slate-800 text-white shadow-lg shadow-black/20 border border-slate-700/50'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                            }`}
                        >
                            <span className={`transition-colors duration-300 ${activeTab === item.id ? 'text-brand-pink' : 'text-slate-500 group-hover:text-brand-pink/70'}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {activeTab === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(230,0,126,0.8)]"></div>
                            )}
                        </button>
                    ))}
                </nav>
                
                {/* Footer User */}
                <div className="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 relative z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-600 shadow-inner">
                            CH
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">Company Hero</p>
                            <p className="text-[10px] text-slate-400 truncate">Workspace</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 md:hidden px-4 py-3 flex items-center justify-between shrink-0 z-30 sticky top-0">
                    <div className="flex items-center gap-2">
                         <div className="h-5 w-1 bg-brand-pink rounded-full"></div>
                         <h1 className="text-lg font-bold text-brand-dark">FinHero</h1>
                    </div>
                    <LanguageSwitcher />
                    <button onClick={() => onTabChange(TabId.HOME)} className="p-2 text-slate-600 hover:text-brand-pink">
                        <Icons.Home />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 lg:p-12 relative z-10">
                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;