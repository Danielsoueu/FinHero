import React from 'react';
import { downloadElementAsImage, printElement, copyTextToClipboard } from '../services/documentService';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

interface PreviewCardProps {
    children: React.ReactNode;
    title?: string;
    contentId: string;
    hasContent: boolean;
    clientName?: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ children, title, contentId, hasContent, clientName }) => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const displayTitle = title || t('common.preview');

    const handleCopy = () => {
        copyTextToClipboard(
            contentId, 
            () => addToast('Conteúdo copiado para a área de transferência!', 'success'),
            () => addToast('Erro ao copiar conteúdo.', 'error')
        );
    };

    const handlePrint = () => {
        const safeClientName = clientName && clientName.trim() ? clientName.trim() : 'FinHero';
        const docTitle = `Documento - ${safeClientName}`;
        printElement(contentId, docTitle);
    };

    const handleDownload = () => {
        const safeClientName = clientName && clientName.trim() ? clientName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'finhero';
        const fileName = `documento-${safeClientName}.jpg`;

        downloadElementAsImage(
            contentId, 
            fileName,
            () => addToast('Download iniciado!', 'success'),
            () => addToast('Erro ao gerar imagem.', 'error')
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-6 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{displayTitle}</h3>
                {hasContent && <div className="h-2 w-2 rounded-full bg-brand-pink animate-pulse"></div>}
            </div>
            
            <div className="flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] relative">
                {hasContent ? (
                    <div className="w-full h-full p-4 overflow-auto flex justify-center custom-scrollbar">
                        {/* Wrapper that handles the scaling for visual fitting in the preview panel */}
                        <div className="w-full max-w-[210mm] transform scale-95 origin-top">
                            {/* The document itself remains white to simulate paper, captured cleanly at 100% size */}
                            <div 
                                id={contentId} 
                                className="bg-white shadow-lg w-full p-8 md:p-10 text-slate-800"
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-400 dark:text-slate-600 p-8 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <p className="font-medium">{t('common.preview_empty')}</p>
                        <p className="text-xs mt-1 opacity-70">{t('common.preview_hint')}</p>
                    </div>
                )}
            </div>

            {hasContent && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <button 
                        onClick={handleCopy}
                        className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        <span className="hidden sm:inline">{t('common.copy')}</span>
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="py-3 px-4 bg-brand-dark dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                        <span className="hidden sm:inline">{t('common.pdf')}</span>
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="py-3 px-4 bg-brand-pink hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-colors shadow-glow flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        <span className="hidden sm:inline">{t('common.download')}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PreviewCard;