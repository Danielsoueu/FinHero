import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, CurrencyCode } from '../types';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (code: CurrencyCode) => void;
    currencies: Currency[];
    formatMoney: (value: number) => string;
}

const currencies: Currency[] = [
    { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Real (Brasil)', decimals: 2 },
    { code: 'USD', symbol: '$', locale: 'en-US', name: 'Dollar (EUA)', decimals: 2 },
    { code: 'CLP', symbol: '$', locale: 'es-CL', name: 'Peso (Chile)', decimals: 0 },
    { code: 'ARS', symbol: '$', locale: 'es-AR', name: 'Peso (Argentina)', decimals: 2 },
    { code: 'PYG', symbol: '₲', locale: 'es-PY', name: 'Guarani (Paraguai)', decimals: 0 },
    { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro (Europa)', decimals: 2 },
    { code: 'PEN', symbol: 'S/', locale: 'es-PE', name: 'Sol (Peru)', decimals: 2 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>(() => {
        const saved = localStorage.getItem('app_currency');
        return currencies.find(c => c.code === saved) || currencies[0];
    });

    const setCurrency = (code: CurrencyCode) => {
        const found = currencies.find(c => c.code === code);
        if (found) {
            setCurrencyState(found);
            localStorage.setItem('app_currency', code);
        }
    };

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
        }).format(value);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, currencies, formatMoney }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};
