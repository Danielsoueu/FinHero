import React, { useState } from 'react';
import { Company, CancellationItem } from '../types';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import CurrencyInput from '../components/CurrencyInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const CancellationProof: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    
    const [company, setCompany] = useState<Company | null>(null);
    const [clientName, setClientName] = useState('');
    const [reason, setReason] = useState('');
    const [items, setItems] = useState<CancellationItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    const [isRecurring, setIsRecurring] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [service, setService] = useState('');
    const [value, setValue] = useState<number | ''>(''); 
    const [date, setDate] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    const getSafeDate = (dateString: string) => {
        if (!dateString) return new Date();
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day, 12, 0, 0);
    };

    const formatDateToISO = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const handleSave = () => {
        if (!company) return addToast(t('common.select_company'), 'error');
        const val = typeof value === 'string' ? (parseFloat(value) || 0) : value;
        if (!date) return addToast('Informe a data.', 'error');
        if (!service) return addToast('Informe o serviço/descrição.', 'error');

        if (editingId) {
            setItems(prev => prev.map(item => item.id === editingId ? {
                ...item,
                service: service,
                value: val,
                date: date
            } : item));
            addToast('Item atualizado!', 'success');
            resetForm();
            return;
        }

        if (isRecurring && dateEnd) {
            const startDateObj = getSafeDate(date);
            const endDateObj = getSafeDate(dateEnd);
            
            if (endDateObj < startDateObj) return addToast('Data final deve ser após a inicial.', 'error');

            const targetDay = startDateObj.getDate();
            const newItems: CancellationItem[] = [];
            let currentDate = new Date(startDateObj);
            let loopGuard = 0;

            while (currentDate <= endDateObj && loopGuard < 60) {
                const isoDate = formatDateToISO(currentDate);
                const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                const itemTitle = service ? `${service} - ${monthName}` : `Mensalidade ${monthName}`;

                newItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    service: itemTitle,
                    value: val,
                    date: isoDate
                });

                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const nextMonthFirst = new Date(year, month + 1, 1, 12, 0, 0);
                const daysInNextMonth = new Date(year, month + 2, 0).getDate();
                nextMonthFirst.setDate(Math.min(targetDay, daysInNextMonth));
                currentDate = nextMonthFirst;
                loopGuard++;
            }

            setItems([...items, ...newItems]);
            addToast(`${newItems.length} itens gerados!`, 'success');
            resetForm();
            return;
        }

        setItems([...items, {
            id: Date.now().toString(),
            service: service,
            value: val,
            date: date
        }]);
        
        addToast('Adicionado!', 'success');
        resetForm();
    };

    const handleEdit = (item: CancellationItem) => {
        setEditingId(item.id); 
        setService(item.service); 
        setValue(item.value);
        setDate(item.date); 
        setIsRecurring(false); 
        setDateEnd('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => { 
        setService(''); 
        setValue(''); 
        setEditingId(null); 
        setDate(''); 
        setDateEnd(''); 
    };

    const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-hero border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('cancel.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />

                <div className="space-y-6">
                    <div>
                        <label className="label-field">{t('common.client')}</label>
                        <input className="input-hero" placeholder={t('common.client_placeholder')} value={clientName} onChange={e => setClientName(e.target.value)} />
                    </div>

                    <div className={`p-6 rounded-2xl border-2 transition-hero space-y-4 ${editingId ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {editingId ? 'Editando Item' : t('juros.new_item')}
                            </h3>
                            {editingId && <button onClick={resetForm} className="text-[10px] font-bold text-brand-pink hover:underline uppercase">Cancelar</button>}
                        </div>

                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                            <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${!isRecurring ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Único</button>
                            <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${isRecurring ? 'bg-white dark:bg-slate-700 text-brand-pink shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Recorrência</button>
                        </div>

                        <input className="input-hero" placeholder={t('cancel.service_placeholder')} value={service} onChange={e => setService(e.target.value)} />
                        <CurrencyInput className="input-hero" placeholder="Valor (Opcional)" value={value} onChange={setValue} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="label-field">{t('cancel.date_label')}</label><input type="date" className="input-hero" value={date} onChange={e => setDate(e.target.value)} /></div>
                            {isRecurring && (
                                <div><label className="label-field">Até quando?</label><input type="date" className="input-hero" value={dateEnd} onChange={e => setDateEnd(e.target.value)} /></div>
                            )}
                        </div>

                        <button onClick={handleSave} className="w-full py-4 rounded-xl font-bold transition shadow-lg text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600">
                            {editingId ? 'Salvar Alterações' : (isRecurring ? 'Gerar Lote' : 'Adicionar Item')}
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-pink/30 dark:hover:border-brand-pink/30 transition-hero">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.service}</span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({item.date.split('-').reverse().join('/')})</span>
                                        </div>
                                        {item.value > 0 && <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{formatCurrency(item.value)}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-pink hover:border-brand-pink transition-hero flex items-center justify-center">✎</button>
                                        <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 transition-hero flex items-center justify-center">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                         <label className="label-field">{t('cancel.reason_label')}</label>
                        <textarea className="input-hero" rows={4} placeholder={t('cancel.reason_placeholder')} value={reason} onChange={e => setReason(e.target.value)} />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setShowResult(true)} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('cancel.generate_btn')}</button>
                        <button onClick={() => {setItems([]); setClientName(''); setReason(''); setShowResult(false);}} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="cancel-preview" hasContent={showResult} clientName={clientName}>
                {company && (
                    <div className="flex flex-col gap-6 text-sm font-sans h-full">
                        <div className="flex flex-col items-center border-b-2 border-slate-100 pb-8">
                            <img src={company.logoUrl} alt="Logo" className="max-h-20 w-auto mb-4 object-contain" />
                            <h2 className="font-black text-2xl text-slate-900">{company.nome}</h2>
                            <p className="text-[11px] font-black text-brand-pink uppercase tracking-[0.2em] mt-2">{t('cancel.doc_title')}</p>
                        </div>
                        
                        <div className="flex justify-between items-end bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div><p className="text-[10px] uppercase font-black text-slate-400 mb-1">{t('common.client')}</p><p className="text-xl font-bold text-slate-900">{clientName || '---'}</p></div>
                            <div className="text-right"><p className="text-[10px] uppercase font-black text-slate-400 mb-1">Data</p><p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p></div>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, i) => (
                                <div key={i} className="p-5 rounded-2xl border border-slate-100 relative overflow-hidden bg-white shadow-sm flex justify-between items-center">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400"></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-base">{item.service}</p>
                                        <p className="text-xs text-slate-500 mt-1">Cancelado em: {item.date.split('-').reverse().join('/')}</p>
                                    </div>
                                    {item.value > 0 && <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>}
                                </div>
                            ))}
                        </div>

                        {reason && (
                            <div className="pt-4 border-t border-slate-200 mt-4">
                                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">{t('cancel.doc_reason_title')}</p>
                                <p className="italic text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">"{reason}"</p>
                            </div>
                        )}

                        <div className="mt-auto pt-8 text-center">
                             <p className="text-xs opacity-60 text-slate-400">{t('common.doc_generated')}</p>
                        </div>
                    </div>
                )}
            </PreviewCard>
            
            <style>{`
                .input-hero { width: 100%; padding: 0.875rem 1.25rem; border-radius: 1rem; border: 2px solid #F1F5F9; font-size: 0.9rem; outline: none; transition: hero; color: #1E293B; font-weight: 500; }
                .dark .input-hero { background-color: #0F172A; border-color: #334155; color: #F8FAFC; }
                .input-hero:focus { border-color: #E6007E; background: white; }
                .dark .input-hero:focus { background-color: #1E293B; border-color: #E6007E; }
                .label-field { font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom: 0.35rem; display: block; text-transform: uppercase; letter-spacing: 0.1em; }
            `}</style>
        </div>
    );
};

export default CancellationProof;