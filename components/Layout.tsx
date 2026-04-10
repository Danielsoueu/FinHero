import React from 'react';
import { TabId, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Juros: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    Porcentagem: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    Cancelamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    Pagamento: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
    Negociacao: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="M11 17l-4 4L2 19V5l4-2 3 3 5 5 5-5 3 3v8"/></svg>,
    Cupons: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V5.25A2.25 2.25 0 0 1 4.25 3h15.5A2.25 2.25 0 0 1 22 5.25V9a2 2 0 0 0-2 2 2 2 0 0 0 2 2v3.75A2.25 2.25 0 0 1 19.75 21H4.25A2.25 2.25 0 0 1 2 18.75V13a2 2 0 0 0 2-2 2 2 0 0 0-2-2Z"/><path d="M14 3v2"/><path d="M14 19v2"/><path d="M14 8v2"/><path d="M14 14v2"/></svg>,
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
};

const LanguageSwitcher = ({ className }: { className?: string }) => {
    const { language, setLanguage } = useLanguage();
    const languages: { id: Language; label: string }[] = [{ id: 'pt', label: 'PT' }, { id: 'en', label: 'EN' }, { id: 'es', label: 'ES' }];

    return (
        <div className={`flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 gap-1 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`flex-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all duration-200 ${
                        language === lang.id ? 'bg-brand-pink text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

const CurrencySwitcher = ({ className }: { className?: string }) => {
    const { currency, setCurrency, currencies } = useCurrency();

    return (
        <div className={`relative group ${className}`}>
            <select
                value={currency.code}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="appearance-none w-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-xl pl-3 pr-8 py-2 border border-slate-200 dark:border-slate-700 outline-none hover:border-brand-pink dark:hover:border-brand-pink transition-all cursor-pointer shadow-sm"
            >
                {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {c.name} ({c.symbol} {c.code})
                    </option>
                ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-pink transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:text-brand-pink dark:hover:text-brand-pink border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
        </button>
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
        { id: TabId.CUPONS, label: t('sidebar.cupons'), icon: <Icons.Cupons /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col relative z-20">
                <div className="p-6 pb-4 flex flex-col gap-5">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onTabChange(TabId.HOME)}>
                        <div className="h-8 w-1.5 bg-brand-pink rounded-full transition-hero group-hover:scale-y-110"></div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">FinHero</h1>
                    </div>
                    <div className="space-y-3">
                        <LanguageSwitcher className="w-full" />
                        <div className="flex items-center gap-2">
                            <CurrencySwitcher className="flex-1" />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-hero ${
                                activeTab === item.id
                                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-hero'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <span className={`${activeTab === item.id ? 'text-brand-pink' : 'text-slate-400 dark:text-slate-500'}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                
                <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center text-[11px] font-black text-white shadow-glow">
                            CH
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Company Hero</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Workspace</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 md:hidden px-4 py-3 flex items-center justify-between shrink-0 z-30 sticky top-0">
                    <div className="flex items-center gap-2" onClick={() => onTabChange(TabId.HOME)}>
                         <div className="h-6 w-1 bg-brand-pink rounded-full"></div>
                         <h1 className="text-lg font-black text-slate-900 dark:text-white">FinHero</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <CurrencySwitcher />
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;