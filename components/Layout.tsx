import React from 'react';
import { TabId, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

// Ícones SVG reutilizáveis
const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Juros: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    Porcentagem: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    Cancelamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    Pagamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
    Negociacao: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="M11 17l-4 4L2 19V5l4-2 3 3 5 5 5-5 3 3v8"/></svg>
};

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    
    const languages: { id: Language; label: string; flag: string }[] = [
        { id: 'pt', label: 'PT', flag: '🇧🇷' },
        { id: 'en', label: 'EN', flag: '🇺🇸' },
        { id: 'es', label: 'ES', flag: '🇪🇸' }
    ];

    return (
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`flex-1 px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                        language === lang.id 
                        ? 'bg-brand-pink text-white shadow-sm' 
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
        <div className="flex min-h-screen bg-brand-light font-sans selection:bg-brand-pink selection:text-white">
            {/* Sidebar - Black with Pink accents */}
            <aside className="w-72 bg-brand-dark text-white flex-shrink-0 hidden md:flex flex-col shadow-2xl relative overflow-hidden z-20">
                {/* Decorative background blur */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-pink to-transparent"></div>

                <div className="p-8 border-b border-slate-800 relative z-10">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
                        <span className="w-2 h-8 bg-brand-pink rounded-full"></span>
                        FinHero
                    </h1>
                    {/* Language Switcher in Sidebar */}
                    <LanguageSwitcher />
                </div>
                
                <nav className="flex-1 p-6 space-y-2 relative z-10">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                                activeTab === item.id
                                    ? 'bg-slate-800 text-brand-pink shadow-inner'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-pink"></div>
                            )}
                            <span className={`transition-colors ${activeTab === item.id ? 'text-brand-pink' : 'text-slate-500 group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                
                <div className="p-6 border-t border-slate-800 relative z-10 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white border border-slate-600">
                            CH
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">Company Hero</p>
                            <p className="text-[10px] text-slate-500">{t('sidebar.workspace')}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 md:hidden p-4 flex items-center justify-between z-20 shrink-0">
                    <h1 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                         <span className="w-2 h-4 bg-brand-pink rounded-full"></span> FinHero
                    </h1>
                    <div className="flex items-center gap-2">
                        {/* Mobile Lang Switcher (Simplified) */}
                         <LanguageSwitcher />
                        <button 
                            onClick={() => onTabChange(TabId.HOME)}
                            className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 ml-2"
                        >
                            <Icons.Home />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-12 bg-slate-50">
                    <div className="max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Layout;