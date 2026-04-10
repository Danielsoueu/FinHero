import React, { useState } from 'react';
import { TabId } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InterestCalculator from './pages/InterestCalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import CancellationProof from './pages/CancellationProof';
import PaymentReceipt from './pages/PaymentReceipt';
import Negotiation from './pages/Negotiation';
import Coupons from './pages/Coupons';

const AppContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>(TabId.HOME);

    const renderContent = () => {
        switch (activeTab) {
            case TabId.HOME:
                return <Dashboard onNavigate={setActiveTab} />;
            case TabId.JUROS:
                return <InterestCalculator />;
            case TabId.PORCENTAGEM:
                return <PercentageCalculator />;
            case TabId.CANCELAMENTO:
                return <CancellationProof />;
            case TabId.PAGAMENTO:
                return <PaymentReceipt />;
            case TabId.NEGOCIACAO:
                return <Negotiation />;
            case TabId.CUPONS:
                return <Coupons />;
            default:
                return <Dashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderContent()}
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <CurrencyProvider>
                <ToastProvider>
                    <ThemeProvider>
                        <AppContent />
                    </ThemeProvider>
                </ToastProvider>
            </CurrencyProvider>
        </LanguageProvider>
    );
};

export default App;