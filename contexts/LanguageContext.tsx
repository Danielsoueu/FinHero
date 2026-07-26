import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('finhero_language');
            if (saved === 'pt' || saved === 'en' || saved === 'es') {
                return saved as Language;
            }
        }
        return 'pt';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('finhero_language', lang);
        }
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = (translations as any)[language] || (translations as any)['pt'];
        
        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                // Fallback to Portuguese if missing in target language
                let fallback: any = (translations as any)['pt'];
                for (const fk of keys) {
                    if (fallback && fallback[fk] !== undefined) {
                        fallback = fallback[fk];
                    } else {
                        return path;
                    }
                }
                return fallback as string;
            }
        }
        
        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};