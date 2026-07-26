import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, UserProfile } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

const UserManagement: React.FC = () => {
    const { isAdmin, userProfile, workspaceSettings, updateWorkspaceSettings, openLoginModal, isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const { t } = useLanguage();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

    // Domain restriction state
    const [domainInput, setDomainInput] = useState<string>(workspaceSettings.allowedDomain || '');
    const [restrictionEnabled, setRestrictionEnabled] = useState<boolean>(workspaceSettings.domainRestrictionEnabled || false);
    const [savingSettings, setSavingSettings] = useState<boolean>(false);

    useEffect(() => {
        setDomainInput(workspaceSettings.allowedDomain || '');
        setRestrictionEnabled(workspaceSettings.domainRestrictionEnabled || false);
    }, [workspaceSettings]);

    // Fetch users in real-time
    useEffect(() => {
        if (!isAuthenticated) {
            setLoadingUsers(false);
            return;
        }

        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const userList: UserProfile[] = [];
            snapshot.forEach((docSnap) => {
                userList.push(docSnap.data() as UserProfile);
            });
            // Sort by createdAt or lastLoginAt descending
            userList.sort((a, b) => new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime());
            setUsers(userList);
            setLoadingUsers(false);
        }, (error) => {
            console.error("Erro ao carregar usuários:", error);
            setLoadingUsers(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    const handleSaveDomainSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) {
            addToast('Apenas administradores podem modificar as configurações.', 'error');
            return;
        }

        setSavingSettings(true);
        try {
            const formattedDomain = domainInput.trim().toLowerCase().replace(/^@/, '');
            await updateWorkspaceSettings({
                allowedDomain: formattedDomain,
                domainRestrictionEnabled: restrictionEnabled
            });
            addToast('Configurações do Google Workspace salvas com sucesso!', 'success');
        } catch (error: any) {
            addToast(error.message || 'Erro ao salvar configurações.', 'error');
        } finally {
            setSavingSettings(false);
        }
    };

    const toggleUserRole = async (targetUser: UserProfile) => {
        if (!isAdmin) return;
        if (targetUser.uid === userProfile?.uid) {
            addToast('Você não pode alterar seu próprio privilégio de administrador.', 'error');
            return;
        }

        const newRole: 'admin' | 'user' = targetUser.role === 'admin' ? 'user' : 'admin';
        try {
            const userDocRef = doc(db, 'users', targetUser.uid);
            await updateDoc(userDocRef, { role: newRole });
            addToast(`Função de ${targetUser.displayName} atualizada para ${newRole === 'admin' ? 'Administrador' : 'Usuário'}.`, 'success');
        } catch (error: any) {
            addToast('Erro ao atualizar função do usuário: ' + error.message, 'error');
        }
    };

    const toggleUserStatus = async (targetUser: UserProfile) => {
        if (!isAdmin) return;
        if (targetUser.uid === userProfile?.uid) {
            addToast('Você não pode bloquear a sua própria conta.', 'error');
            return;
        }

        const newStatus: 'active' | 'blocked' = targetUser.status === 'active' ? 'blocked' : 'active';
        try {
            const userDocRef = doc(db, 'users', targetUser.uid);
            await updateDoc(userDocRef, { status: newStatus });
            addToast(`Status de ${targetUser.displayName} alterado para ${newStatus === 'active' ? 'Ativo' : 'Bloqueado'}.`, 'success');
        } catch (error: any) {
            addToast('Erro ao alterar status do usuário: ' + error.message, 'error');
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const activeCount = users.filter(u => u.status === 'active').length;

    if (!isAuthenticated) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center max-w-2xl mx-auto my-12">
                <div className="w-20 h-20 bg-brand-pink/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-pink">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Autenticação Necessária</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    Faça login com sua conta Google ou Google Workspace para visualizar seu perfil e acessar a central de usuários.
                </p>
                <button
                    onClick={openLoginModal}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-pink dark:hover:bg-brand-hover text-white font-bold text-base transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Entrar com Google
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isAdmin ? 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            {isAdmin ? 'Visão de Administrador' : 'Visão de Usuário'}
                        </span>
                        {workspaceSettings.domainRestrictionEnabled && workspaceSettings.allowedDomain && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Domínio Restrito: @{workspaceSettings.allowedDomain}
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Central de Autenticação & Usuários</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {isAdmin ? 'Gerencie as contas, funções e restrições de domínio do seu Google Workspace.' : 'Visualize as informações do seu perfil e permissões na plataforma.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 p-2 pr-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="Avatar" className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-pink/30" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-brand-pink text-white font-black flex items-center justify-center text-sm shadow-sm">
                                {userProfile?.displayName.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{userProfile?.displayName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{userProfile?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Usuários</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalUsers}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-brand-pink flex items-center justify-center font-bold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Administradores</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{adminCount}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Usuários Ativos</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{activeCount}</p>
                    </div>
                </div>
            </div>

            {/* Google Workspace Domain Restriction Settings (Admin Only) */}
            {isAdmin && (
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Restrição de Domínio Google Workspace</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Limite o login no sistema exclusivamente aos e-mails corporativos da sua empresa.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSaveDomainSettings} className="space-y-4 pt-2">
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={restrictionEnabled}
                                    onChange={(e) => setRestrictionEnabled(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-pink"></div>
                            </label>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Exigir e-mail de um domínio Google Workspace específico para entrar
                            </span>
                        </div>

                        {restrictionEnabled && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in pt-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                                    <input
                                        type="text"
                                        value={domainInput}
                                        onChange={(e) => setDomainInput(e.target.value)}
                                        placeholder="minhaempresa.com.br"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-9 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-brand-pink transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={savingSettings}
                                    className="px-6 py-3 rounded-2xl bg-brand-pink hover:bg-brand-hover text-white font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {savingSettings ? 'Salvando...' : 'Salvar Restrição'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Users Table / List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Lista de Usuários Cadastrados</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {isAdmin ? 'Como Administrador, você pode alterar funções (Admin / Usuário) e bloquear/desbloquear acessos.' : 'Usuários registrados no workspace com autenticação do Google.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nome ou e-mail..."
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-brand-pink transition-colors w-full sm:w-64"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                        >
                            <option value="all">Todas as Funções</option>
                            <option value="admin">Apenas Administradores</option>
                            <option value="user">Apenas Usuários</option>
                        </select>
                    </div>
                </div>

                {loadingUsers ? (
                    <div className="p-12 text-center text-slate-400">
                        <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-xs font-bold">Carregando lista de usuários...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <p className="text-sm font-bold">Nenhum usuário encontrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Usuário</th>
                                    <th className="py-4 px-6">Domínio / E-mail</th>
                                    <th className="py-4 px-6">Função</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Último Acesso</th>
                                    {isAdmin && <th className="py-4 px-6 text-right">Ações (Admin)</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((u) => {
                                    const isSelf = u.uid === userProfile?.uid;
                                    return (
                                        <tr key={u.uid} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {u.photoURL ? (
                                                        <img src={u.photoURL} alt="" className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                                                            {u.displayName.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                            {u.displayName}
                                                            {isSelf && (
                                                                <span className="text-[10px] bg-brand-pink/10 text-brand-pink font-bold px-2 py-0.5 rounded-md">
                                                                    Você
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                                    @{u.email.split('@')[1] || 'google.com'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}>
                                                    {u.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                    u.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                                        : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    {u.status === 'active' ? 'Ativo' : 'Bloqueado'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '---'}
                                            </td>

                                            {isAdmin && (
                                                <td className="py-4 px-6 text-right space-x-2">
                                                    <button
                                                        onClick={() => toggleUserRole(u)}
                                                        disabled={isSelf}
                                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Alternar Função (Admin / Usuário)"
                                                    >
                                                        {u.role === 'admin' ? 'Tornar Usuário' : 'Tornar Admin'}
                                                    </button>

                                                    <button
                                                        onClick={() => toggleUserStatus(u)}
                                                        disabled={isSelf}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                                            u.status === 'active'
                                                                ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-400'
                                                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        {u.status === 'active' ? 'Bloquear' : 'Ativar'}
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Comparison Box between User View and Admin View */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-brand-pink mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Visão do Usuário Padrão
                    </div>
                    <h3 className="text-xl font-black mb-3">O que o Usuário Padrão acessa:</h3>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span> Acesso completo às calculadoras financeiras (Juros, Porcentagens)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span> Emissão e exportação de PDF de Recibos, Comprovantes de Cancelamento e Propostas de Negociação
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span> Consulta de CNPJs e consulta de Unidades/Endereços
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span> Perfil com e-mail corporativo Google do workspace
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink text-xs font-bold text-white mb-4 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Visão do Administrador
                    </div>
                    <h3 className="text-xl font-black mb-3">O que o Administrador acessa:</h3>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                        <li className="flex items-center gap-2">
                            <span className="text-brand-pink font-bold">★</span> Todas as ferramentas da visão de usuário
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-brand-pink font-bold">★</span> <strong>Gerenciador de Usuários:</strong> Promover/Demover usuários para Admin
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-brand-pink font-bold">★</span> <strong>Controle de Acesso:</strong> Suspender ou bloquear e-mails do sistema
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-brand-pink font-bold">★</span> <strong>Segurança do Domínio:</strong> Restringir o login para o domínio corporativo do seu Google Workspace (ex: <code>@suaempresa.com.br</code>)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
