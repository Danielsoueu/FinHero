import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const languages: { id: Language; label: string }[] = [
        { id: 'pt', label: 'PT' },
        { id: 'en', label: 'EN' },
        { id: 'es', label: 'ES' }
    ];

    return (
        <div className="flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 gap-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
                        language === lang.id ? 'bg-brand-pink text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:text-brand-pink dark:hover:text-brand-pink border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Alternar Tema"
        >
            {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <path strokeWidth="2" strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
};

const LoginScreen: React.FC = () => {
    const { loginWithGoogle, workspaceSettings } = useAuth();
    const { addToast } = useToast();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        setErrorMessage(null);
        try {
            await loginWithGoogle();
            addToast('Login realizado com sucesso via Google!', 'success');
        } catch (error: any) {
            console.error("Login Error:", error);
            const msg = error.message || 'Erro ao realizar login com o Google.';
            setErrorMessage(msg);
            addToast('Falha na autenticação.', 'error');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
            {/* Ambient background glow elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-pink/10 dark:bg-brand-pink/15 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

            {/* Top Navigation / Controls */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-brand-pink rounded-full"></div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">FinHero</span>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Center Login Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-auto">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                    {/* Header Accent Pill */}
                    <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5">
                        <div className="h-8 w-2 bg-brand-pink rounded-full"></div>
                    </div>

                    <div className="text-center mb-8">
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-[11px] font-bold uppercase tracking-wider mb-2">
                            Acesso Restrito
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Entrar no FinHero
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Acesse com sua conta corporativa Google Workspace para utilizar todas as ferramentas e serviços financeiros da plataforma.
                        </p>
                    </div>

                    {/* Error Notice */}
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs leading-relaxed space-y-2">
                            <div className="flex items-start gap-2.5 font-bold">
                                <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Detalhes da Autenticação:</span>
                            </div>
                            <p className="pl-6">{errorMessage}</p>
                            {errorMessage.includes('unauthorized-domain') && (
                                <div className="pl-6 pt-1 text-[11px] text-red-700 dark:text-red-400 bg-red-100/60 dark:bg-red-900/40 p-2.5 rounded-xl font-mono break-all">
                                    💡 Para autorizar este domínio no Firebase Console:
                                    <br />1. Acesse Firebase Console &gt; Authentication &gt; Settings
                                    <br />2. Adicione este domínio aos Domínios Autorizados:
                                    <br /><strong className="text-slate-900 dark:text-white bg-white/80 dark:bg-slate-950/80 px-1.5 py-0.5 rounded mt-1 inline-block">{currentHostname}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Domain Restriction Alert */}
                    {workspaceSettings.domainRestrictionEnabled && workspaceSettings.allowedDomain && !errorMessage && (
                        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-800 dark:text-amber-300">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="text-xs">
                                <span className="font-bold block mb-0.5">Acesso Restrito ao Domínio:</span>
                                Apenas e-mails terminados em <strong className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">@{workspaceSettings.allowedDomain}</strong> possuem permissão.
                            </div>
                        </div>
                    )}

                    {/* Primary Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                        {isLoggingIn ? (
                            <>
                                <div className="w-5 h-5 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
                                <span>Conectando com o Google...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span>Entrar com Conta Google</span>
                            </>
                        )}
                    </button>

                    {/* Features overview pill list */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
                            Recursos inclusos após o login:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                                <span>📈</span>
                                <span>Calculadora Juros</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                                <span>🏢</span>
                                <span>Consulta CNPJ</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                                <span>🏷️</span>
                                <span>Gestão de Cupons</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                                <span>🛡️</span>
                                <span>Permissões FinHero</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-600 relative z-10">
                <p>© {new Date().getFullYear()} FinHero — Plataforma Corporativa Segura com Autenticação Google Workspace</p>
            </footer>
        </div>
    );
};

export default LoginScreen;
