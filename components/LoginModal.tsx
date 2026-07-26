import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LoginModal: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal, loginWithGoogle, simulateLogin, workspaceSettings } = useAuth();
    const { addToast } = useToast();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showDemoOptions, setShowDemoOptions] = useState(false);
    const [customEmail, setCustomEmail] = useState('');

    if (!isLoginModalOpen) return null;

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        setErrorMessage(null);
        try {
            await loginWithGoogle();
            addToast('Login realizado com sucesso via Google!', 'success');
            closeLoginModal();
        } catch (error: any) {
            console.error("Login Error:", error);
            const msg = error.message || 'Erro ao realizar login com o Google.';
            setErrorMessage(msg);
            setShowDemoOptions(true);
            addToast('Ocorreu um erro no login. Veja as instruções ou use o modo de teste.', 'info');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSimulatedLogin = (role: 'admin' | 'user') => {
        simulateLogin(role, customEmail.trim() || undefined);
        addToast(`Login de teste (${role === 'admin' ? 'Administrador' : 'Usuário'}) ativado com sucesso!`, 'success');
    };

    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div 
                className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden my-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background ambient gradient element */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-pink/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Close button */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-black/5">
                        <div className="h-7 w-2 bg-brand-pink rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Central de Login FinHero</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        Acesse a plataforma com sua conta corporativa Google Workspace ou e-mail Google para sincronizar suas permissões e estatísticas.
                    </p>
                </div>

                {/* Error Banner if authentication threw an error */}
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
                                💡 Para autorizar no Firebase Console:
                                <br />1. Acesse Firebase Console &gt; Authentication &gt; Settings
                                <br />2. Adicione este domínio aos Domínios Autorizados:
                                <br /><strong className="text-slate-900 dark:text-white bg-white/80 dark:bg-slate-950/80 px-1.5 py-0.5 rounded mt-1 inline-block">{currentHostname}</strong>
                            </div>
                        )}
                    </div>
                )}

                {/* Domain Restriction Notice if active */}
                {workspaceSettings.domainRestrictionEnabled && workspaceSettings.allowedDomain && !errorMessage && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-800 dark:text-amber-300">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-xs">
                            <span className="font-bold block mb-0.5">Acesso Restrito ao Domínio:</span>
                            Apenas e-mails terminados em <strong className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">@{workspaceSettings.allowedDomain}</strong> possuem permissão para entrar.
                        </div>
                    </div>
                )}

                {/* Main Google Sign In Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                    {isLoggingIn ? (
                        <>
                            <div className="w-5 h-5 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
                            <span>Autenticando com Google...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Entrar com Conta Google</span>
                        </>
                    )}
                </button>

                {/* Demo / Testing Toggle */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setShowDemoOptions(!showDemoOptions)}
                        className="w-full text-center text-xs font-semibold text-brand-pink hover:underline flex items-center justify-center gap-1.5 py-1"
                    >
                        <span>{showDemoOptions ? 'Ocultar opções de simulação de teste' : '⚡ Testar sem popup do Google (Simular Admin/Usuário)'}</span>
                        <svg className={`w-3.5 h-3.5 transition-transform ${showDemoOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showDemoOptions && (
                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-fade-in">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Selecione um perfil para testar a interface e os módulos de administração instantaneamente:
                            </p>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail para teste (opcional):</label>
                                <input
                                    type="email"
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    placeholder={`exemplo@${workspaceSettings.allowedDomain || 'companyhero.com'}`}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => handleSimulatedLogin('admin')}
                                    className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                >
                                    <span>👑 Admin Demo</span>
                                </button>
                                <button
                                    onClick={() => handleSimulatedLogin('user')}
                                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                >
                                    <span>👤 Usuário Demo</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
