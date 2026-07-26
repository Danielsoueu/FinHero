import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, UserProfile, WorkspaceSettings } from '../services/firebase';

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    workspaceSettings: WorkspaceSettings;
    loginWithGoogle: () => Promise<void>;
    logoutUser: () => Promise<void>;
    updateWorkspaceSettings: (settings: Partial<WorkspaceSettings>) => Promise<void>;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>({
        domainRestrictionEnabled: false,
        allowedDomain: ''
    });

    // Listen to Workspace Settings
    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'workspace');
        const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                setWorkspaceSettings(snapshot.data() as WorkspaceSettings);
            }
        }, (error) => {
            console.warn("Sem acesso inicial ou erro nas configurações da workspace:", error);
        });

        return () => unsubscribe();
    }, []);

    // Listen to Auth State and User Profile
    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                
                unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const profileData = docSnap.data() as UserProfile;
                        if (profileData.status === 'blocked') {
                            logout();
                            setUserProfile(null);
                        } else {
                            setUserProfile(profileData);
                        }
                    } else {
                        // Profile hasn't synced yet or was missing
                        setUserProfile(null);
                    }
                    setIsLoading(false);
                }, (error) => {
                    console.error("Erro ao carregar perfil do usuário:", error);
                    setIsLoading(false);
                });
            } else {
                setUserProfile(null);
                setIsLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            setIsLoginModalOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const logoutUser = async () => {
        setIsLoading(true);
        try {
            await logout();
            setUserProfile(null);
            setCurrentUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateWorkspaceSettings = async (newSettings: Partial<WorkspaceSettings>) => {
        if (!userProfile || userProfile.role !== 'admin') {
            throw new Error('Apenas administradores podem alterar as configurações.');
        }

        const settingsRef = doc(db, 'settings', 'workspace');
        const updatedData = {
            ...workspaceSettings,
            ...newSettings,
            updatedAt: new Date().toISOString(),
            updatedBy: userProfile.email
        };

        await setDoc(settingsRef, updatedData, { merge: true });
        setWorkspaceSettings(updatedData);
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const isAdmin = userProfile?.role === 'admin';
    const isAuthenticated = !!currentUser && userProfile?.status !== 'blocked';

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                userProfile,
                isAdmin,
                isAuthenticated,
                isLoading,
                workspaceSettings,
                loginWithGoogle,
                logoutUser,
                updateWorkspaceSettings,
                openLoginModal,
                closeLoginModal,
                isLoginModalOpen
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
