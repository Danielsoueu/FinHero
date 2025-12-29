import React, { useState } from 'react';
import { TabId } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InterestCalculator from './pages/InterestCalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import CancellationProof from './pages/CancellationProof';
import PaymentReceipt from './pages/PaymentReceipt';
import Negotiation from './pages/Negotiation';

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
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </LanguageProvider>
    );
};

export default App;