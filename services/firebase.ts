import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Enforce local persistence so login persists across browser refreshes and sessions until explicit logout
setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Could not set browserLocalPersistence:", err);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export const db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'admin' | 'user';
    status: 'active' | 'blocked';
    domain?: string;
    createdAt: string;
    lastLoginAt: string;
}

export interface WorkspaceSettings {
    allowedDomain?: string;
    allowedDomains?: string[];
    allowedEmails?: string[];
    domainRestrictionEnabled: boolean;
    updatedAt: string;
    updatedBy?: string;
}

// Function to sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Fetch workspace settings to check domain restriction
        const settingsRef = doc(db, 'settings', 'workspace');
        const settingsSnap = await getDoc(settingsRef);
        let settings: WorkspaceSettings = { domainRestrictionEnabled: false, updatedAt: new Date().toISOString() };
        
        if (settingsSnap.exists()) {
            settings = settingsSnap.data() as WorkspaceSettings;
        }

        const userDomain = (user.email ? user.email.split('@')[1] : '').toLowerCase().trim();
        const userEmailNormalized = (user.email || '').toLowerCase().trim();

        // Whitelisted default domains and specific emails permitted across the platform
        const defaultAllowedEmails = [
            'financeiro@meuescritoriovirtual.com',
            'danielcontaescolar@gmail.com'
        ];
        const defaultAllowedDomains = [
            'companyhero.com',
            'meuescritoriovirtual.com',
            'meuescritoriovirtual.com.br'
        ];

        // Gather configured allowed domains (array or comma/semicolon/space-separated string)
        const customAllowedDomains: string[] = [
            ...(Array.isArray(settings.allowedDomains) ? settings.allowedDomains : []),
            ...(settings.allowedDomain ? settings.allowedDomain.split(/[,;\s]+/) : [])
        ].map(d => d.replace(/^@/, '').toLowerCase().trim()).filter(Boolean);

        const allAllowedDomains = Array.from(new Set([...defaultAllowedDomains, ...customAllowedDomains]));

        // Gather all allowed emails
        const allAllowedEmails = Array.from(new Set([
            ...defaultAllowedEmails,
            ...(settings.allowedEmails || []).map(e => e.toLowerCase().trim())
        ]));

        // Check if user matches whitelist
        const isWhitelistedEmail = allAllowedEmails.includes(userEmailNormalized);
        const isWhitelistedDomain = allAllowedDomains.includes(userDomain);

        // Sync or check user profile in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const existingProfile = userSnap.exists() ? (userSnap.data() as UserProfile) : null;

        const usersSnap = await getDocs(collection(db, 'users'));
        const isFirstUser = usersSnap.empty;

        // Determine if current user is an admin or owner account (exempt from domain restrictions)
        const isOwnerAccount = userEmailNormalized === 'danielcontaescolar@gmail.com';
        const isAdminUser = (existingProfile?.role === 'admin') || isFirstUser || isOwnerAccount;

        // Check if domain restriction is active (administrators, owner, whitelisted domains, and whitelisted emails pass)
        if (settings.domainRestrictionEnabled && !isAdminUser && !isWhitelistedEmail && !isWhitelistedDomain) {
            await firebaseSignOut(auth);
            const domainDisplay = allAllowedDomains.map(d => `@${d}`).join(', ');
            throw new Error(`Acesso restrito aos domínios corporativos (${domainDisplay}) ou e-mails autorizados (ex: financeiro@meuescritoriovirtual.com).`);
        }

        const now = new Date().toISOString();

        if (!userSnap.exists()) {
            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
                photoURL: user.photoURL || undefined,
                role: isAdminUser ? 'admin' : 'user',
                status: 'active',
                domain: userDomain,
                createdAt: now,
                lastLoginAt: now,
            };

            await setDoc(userRef, newProfile);
            return { user, profile: newProfile };
        } else {
            if (existingProfile!.status === 'blocked') {
                await firebaseSignOut(auth);
                throw new Error('Sua conta está suspensa ou bloqueada pelo administrador.');
            }

            // Ensure owner account always maintains admin role
            const updatedRole = isOwnerAccount ? 'admin' : existingProfile!.role;

            await updateDoc(userRef, {
                lastLoginAt: now,
                displayName: user.displayName || existingProfile!.displayName,
                photoURL: user.photoURL || existingProfile!.photoURL,
                role: updatedRole,
            });

            return { user, profile: { ...existingProfile!, role: updatedRole, lastLoginAt: now } };
        }
    } catch (error: any) {
        console.error("Erro no login com Google:", error);
        if (error.code === 'auth/unauthorized-domain') {
            const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'este domínio';
            throw new Error(`O domínio "${currentHostname}" precisa ser adicionado aos "Domínios Autorizados" no projeto Firebase correto (${firebaseConfig.projectId}).`);
        }
        if (error.code === 'auth/operation-not-allowed') {
            throw new Error(`O método de login do Google precisa ser ATIVADO no Firebase Console (Authentication > Método de Login > Google > Ativar).`);
        }
        throw error;
    }
};

export const logout = async () => {
    return await firebaseSignOut(auth);
};
