import React from 'react';
import { downloadElementAsImage, printElement, copyTextToClipboard } from '../services/documentService';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

interface PreviewCardProps {
    children: React.ReactNode;
    title?: string;
    contentId: string;
    hasContent: boolean;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ children, title, contentId, hasContent }) => {
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

    const handleDownload = () => {
        downloadElementAsImage(
            contentId, 
            'documento-finhero.jpg',
            () => addToast('Download iniciado!', 'success'),
            () => addToast('Erro ao gerar imagem.', 'error')
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 flex flex-col h-full overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{displayTitle}</h3>
                {hasContent && <div className="h-2 w-2 rounded-full bg-brand-pink animate-pulse"></div>}
            </div>
            
            <div className="flex-grow flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden min-h-[400px] relative">
                {hasContent ? (
                    <div className="w-full h-full p-4 overflow-auto flex justify-center custom-scrollbar">
                        <div 
                            id={contentId} 
                            className="bg-white shadow-lg w-full max-w-[210mm] p-8 md:p-10 text-slate-800 transform scale-95 origin-top"
                        >
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-400 p-8 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-2xl opacity-50">📄</div>
                        <p className="font-medium">{t('common.preview_empty')}</p>
                        <p className="text-xs mt-1 opacity-70">{t('common.preview_hint')}</p>
                    </div>
                )}
            </div>

            {hasContent && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <button 
                        onClick={handleCopy}
                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:scale-110 transition-transform">📋</span> <span className="hidden sm:inline">{t('common.copy')}</span>
                    </button>
                    <button 
                        onClick={() => printElement(contentId)}
                        className="py-3 px-4 bg-brand-dark hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:scale-110 transition-transform">🖨️</span> <span className="hidden sm:inline">{t('common.pdf')}</span>
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="py-3 px-4 bg-brand-pink hover:bg-brand-hover text-white text-sm font-bold rounded-xl transition-colors shadow-glow flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:scale-110 transition-transform">⬇️</span> <span className="hidden sm:inline">{t('common.download')}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PreviewCard;