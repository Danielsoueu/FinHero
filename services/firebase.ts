import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
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

        const userDomain = user.email ? user.email.split('@')[1] : '';

        // Check if domain restriction is active
        if (settings.domainRestrictionEnabled && settings.allowedDomain) {
            const allowed = settings.allowedDomain.toLowerCase().trim();
            if (userDomain.toLowerCase() !== allowed) {
                await firebaseSignOut(auth);
                throw new Error(`Acesso restrito ao domínio corporativo: @${settings.allowedDomain}`);
            }
        }

        // Sync or create user profile in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        const now = new Date().toISOString();

        if (!userSnap.exists()) {
            // First user or specific condition can default to admin if needed
            // Check if there are any existing users to determine if first user should be admin
            const usersSnap = await getDocs(collection(db, 'users'));
            const isFirstUser = usersSnap.empty;

            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
                photoURL: user.photoURL || undefined,
                role: isFirstUser ? 'admin' : 'user',
                status: 'active',
                domain: userDomain,
                createdAt: now,
                lastLoginAt: now,
            };

            await setDoc(userRef, newProfile);
            return { user, profile: newProfile };
        } else {
            const existingProfile = userSnap.data() as UserProfile;

            if (existingProfile.status === 'blocked') {
                await firebaseSignOut(auth);
                throw new Error('Sua conta está suspensa ou bloqueada pelo administrador.');
            }

            // Update last login
            await updateDoc(userRef, {
                lastLoginAt: now,
                displayName: user.displayName || existingProfile.displayName,
                photoURL: user.photoURL || existingProfile.photoURL,
            });

            return { user, profile: { ...existingProfile, lastLoginAt: now } };
        }
    } catch (error: any) {
        console.error("Erro no login com Google:", error);
        throw error;
    }
};

export const logout = async () => {
    return await firebaseSignOut(auth);
};
