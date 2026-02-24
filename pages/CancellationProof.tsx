import React, { useState } from 'react';
import { Company } from '../types';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import { useLanguage } from '../contexts/LanguageContext';

const CancellationProof: React.FC = () => {
    const { t } = useLanguage();
    const [company, setCompany] = useState<Company | null>(null);
    const [client, setClient] = useState('');
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleGenerate = () => {
        if (!company || !client || !date) return alert(t('common.preview_hint'));
        setShowResult(true);
    };

    const handleClear = () => {
        setClient(''); setService(''); setDate(''); setReason(''); setShowResult(false);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-card border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-pink">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark dark:text-white">{t('cancel.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />
                
                <div className="space-y-5">
                    <div>
                        <label className="label-field">{t('common.client')}</label>
                        <input className="input-field" placeholder={t('common.client_placeholder')} value={client} onChange={e => setClient(e.target.value)} />
                    </div>
                    <div>
                        <label className="label-field">{t('cancel.service_label')}</label>
                        <input className="input-field" placeholder={t('cancel.service_placeholder')} value={service} onChange={e => setService(e.target.value)} />
                    </div>
                    <div>
                        <label className="label-field ml-1">{t('cancel.date_label')}</label>
                        <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                         <label className="label-field">{t('cancel.reason_label')}</label>
                        <textarea className="input-field" rows={4} placeholder={t('cancel.reason_placeholder')} value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={handleGenerate} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('cancel.generate_btn')}</button>
                        <button onClick={handleClear} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="cancel-preview" hasContent={showResult} clientName={client}>
                {company && (
                    <div className="flex flex-col gap-8 text-sm font-sans h-full justify-between">
                        <div>
                            <div className="text-center border-b border-slate-100 pb-8 mb-6">
                                <img src={company.logoUrl} alt="Logo" className="max-h-24 w-auto mx-auto mb-5 object-contain" />
                                <h2 className="text-2xl font-bold text-brand-dark tracking-tight">{company.nome}</h2>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('common.client')}</p>
                                    <p className="text-xl font-bold text-brand-dark">{client}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('cancel.doc_service')}</p>
                                        <p className="font-semibold text-slate-700">{service || "Geral"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('cancel.doc_date')}</p>
                                        <p className="font-semibold text-slate-700">{date.split('-').reverse().join('/')}</p>
                                    </div>
                                </div>
                                {reason && (
                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{t('cancel.doc_reason_title')}</p>
                                        <p className="italic text-slate-600 bg-white p-3 rounded-lg border border-slate-100">"{reason}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Block Fixed for PDF with Hardcoded Styles */}
                        <div 
                            className="text-center p-6 rounded-2xl shadow-lg"
                            style={{ 
                                backgroundColor: '#0F172A', 
                                color: '#ffffff', 
                                printColorAdjust: 'exact', 
                                WebkitPrintColorAdjust: 'exact',
                                border: '1px solid #0F172A'
                            }}
                        >
                             <p className="font-bold text-lg tracking-widest text-brand-pink" style={{ color: '#E6007E' }}>{t('cancel.doc_title')}</p>
                             <p className="text-xs mt-2 opacity-80" style={{ color: '#94a3b8' }}>{t('common.doc_generated')}</p>
                        </div>
                    </div>
                )}
            </PreviewCard>
            
            <style>{`
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; font-size: 0.875rem; outline: none; transition: all 0.2s; color: #334155; }
                .dark .input-field { background-color: #0F172A; border-color: #334155; color: #F8FAFC; }
                .input-field:focus { border-color: #E6007E; box-shadow: 0 0 0 3px rgba(230, 0, 126, 0.1); }
                .dark .input-field:focus { border-color: #E6007E; background-color: #1E293B; }
                .label-field { font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.25rem; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};

export default CancellationProof;