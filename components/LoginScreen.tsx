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
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                        language === lang.id 
                            ? 'bg-brand-pink text-white shadow-xs' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
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
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-pink dark:hover:text-brand-pink border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs"
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
        <div className="min-h-screen w-full bg-[#f4f5f7] dark:bg-[#0d1117] text-slate-800 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-300">
            
            {/* Subtle Minimalist Soft Background Spheres (matching reference image concept) */}
            <div className="absolute top-10 left-10 w-28 h-28 rounded-full bg-slate-200/60 dark:bg-slate-800/40 shadow-inner pointer-events-none" />
            <div className="absolute bottom-12 right-12 w-36 h-36 rounded-full bg-slate-200/50 dark:bg-slate-800/30 shadow-inner pointer-events-none" />
            <div className="absolute top-1/3 right-16 w-16 h-16 rounded-full bg-brand-pink/10 dark:bg-brand-pink/5 pointer-events-none" />

            {/* Top Bar Navigation */}
            <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
                {/* Minimalist Brand Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="h-6 w-1.5 bg-brand-pink rounded-full"></div>
                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                        Company Hero
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>

            {/* Minimalist Centered Form (Inspired directly by the reference image layout) */}
            <main className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex items-center justify-center relative z-10 my-auto">
                <div className="w-full space-y-6">
                    
                    {/* Minimalist Header */}
                    <div className="text-center space-y-2 mb-8">
                        <div className="inline-flex items-center justify-center gap-3 mb-2">
                            <div className="w-2.5 h-8 bg-brand-pink rounded-full"></div>
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                Login
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Acesse a plataforma corporativa Company Hero
                        </p>
                    </div>

                    {/* Error Notification */}
                    {errorMessage && (
                        <div className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs text-left leading-relaxed space-y-2">
                            <div className="flex items-start gap-2 font-bold">
                                <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Erro de Autenticação:</span>
                            </div>
                            <p className="pl-6">{errorMessage}</p>
                            {errorMessage.includes('unauthorized-domain') && (
                                <div className="pl-6 pt-1 text-[11px] text-red-700 dark:text-red-400 bg-red-100/60 dark:bg-red-900/40 p-2.5 rounded-xl font-mono break-all">
                                    💡 Adicione o domínio no Firebase Console:
                                    <br /><strong className="text-slate-900 dark:text-white bg-white/80 dark:bg-slate-950/80 px-1.5 py-0.5 rounded mt-1 inline-block">{currentHostname}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Domain Restriction Notice */}
                    {workspaceSettings.domainRestrictionEnabled && workspaceSettings.allowedDomain && !errorMessage && (
                        <div className="w-full p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-amber-800 dark:text-amber-300 text-left">
                            <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="text-xs">
                                <span className="font-bold block mb-0.5">Acesso Restrito:</span>
                                Apenas e-mails <strong className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">@{workspaceSettings.allowedDomain}</strong> ou pré-autorizados.
                            </div>
                        </div>
                    )}

                    {/* Minimalist Input-Style Field for Single-Click Google Auth */}
                    <div className="space-y-4">
                        {/* Minimal Google SSO Badge / Button with shadow elevation as in image */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoggingIn}
                            className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-sm sm:text-base flex items-center justify-between gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 hover:border-brand-pink/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                                    {isLoggingIn ? 'Autenticando...' : 'Entrar com o Google'}
                                </span>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>

                        {/* Minimal Action Button matching dark pill button from screenshot */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoggingIn}
                            className="w-full py-4 px-6 rounded-2xl bg-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {isLoggingIn ? 'Conectando...' : 'LOGIN'}
                        </button>
                    </div>

                    <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-4">
                        Autenticação segura via Google Workspace
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-[11px] text-slate-400 dark:text-slate-600 relative z-20">
                <p>© {new Date().getFullYear()} Company Hero — Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default LoginScreen;
