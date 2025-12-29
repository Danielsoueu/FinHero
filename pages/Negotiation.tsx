import React, { useState } from 'react';
import { Company, InvoiceItem } from '../types';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import { useLanguage } from '../contexts/LanguageContext';

const Negotiation: React.FC = () => {
    const { t } = useLanguage();
    const [company, setCompany] = useState<Company | null>(null);
    const [client, setClient] = useState('');
    const [discount, setDiscount] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    // Temp item
    const [title, setTitle] = useState('');
    const [val, setVal] = useState('');

    const addItem = () => {
        if (!title || !val) return;
        setItems([...items, { id: Date.now().toString(), titulo: title, valor: parseFloat(val) }]);
        setTitle(''); setVal('');
    };

    const handleGenerate = () => {
        if (!company || !client || items.length === 0) return alert(t('common.preview_hint'));
        setShowResult(true);
    };

    const total = items.reduce((s, i) => s + i.valor, 0);
    const discAmount = total * ((parseFloat(discount) || 0) / 100);
    const finalAmount = total - discAmount;
    const formatMoney = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-pink">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 4-4"/><path d="M11 17l-4 4L2 19V5l4-2 3 3 5 5 5-5 3 3v8"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark">{t('neg.title')}</h2>
                </div>

                <CompanySelector selected={company} onSelect={setCompany} />

                <div className="space-y-5">
                    <div>
                        <label className="label-field">{t('common.client')}</label>
                        <input className="input-field" placeholder={t('common.client_placeholder')} value={client} onChange={e => setClient(e.target.value)} />
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t('neg.add_debt_title')}</label>
                        <div className="flex gap-3 mb-3">
                            <input className="input-field flex-grow" placeholder={t('neg.invoice_placeholder')} value={title} onChange={e => setTitle(e.target.value)} />
                            <input className="input-field w-1/3" type="number" placeholder={t('neg.val_placeholder')} value={val} onChange={e => setVal(e.target.value)} />
                        </div>
                        <button onClick={addItem} className="w-full py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl font-bold text-sm transition">{t('neg.add_list_btn')}</button>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-2 max-h-40 overflow-y-auto custom-scrollbar shadow-inner">
                        {items.length === 0 ? <p className="text-xs text-center text-gray-400 py-4">{t('neg.no_debts')}</p> : 
                            items.map((it, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-3 border-b last:border-0 border-slate-50">
                                    <span className="text-slate-700 font-medium">{it.titulo}</span>
                                    <div className="flex gap-3">
                                        <span className="font-mono text-brand-dark font-bold">{formatMoney(it.valor)}</span>
                                        <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold transition">×</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="pt-2">
                        <label className="label-field ml-1">{t('neg.global_discount')}</label>
                        <input className="input-field" type="number" placeholder="0" value={discount} onChange={e => setDiscount(e.target.value)} />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button onClick={handleGenerate} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('neg.generate_btn')}</button>
                        <button onClick={() => { setItems([]); setShowResult(false); }} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="neg-preview" hasContent={showResult}>
                 {company && (
                     <div className="flex flex-col gap-6 text-sm font-sans h-full">
                         <div className="flex flex-col items-center pb-6 border-b border-slate-100">
                             <img src={company.logoUrl} className="h-16 w-auto mb-4 object-contain" alt="logo" />
                             <h2 className="font-bold text-xl text-brand-dark">{company.nome}</h2>
                             <span className="bg-brand-pink/10 text-brand-pink text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-2">{t('neg.doc_badge')}</span>
                         </div>

                         <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t('common.client')}</p>
                             <p className="font-bold text-lg text-brand-dark">{client}</p>
                         </div>

                         <div className="flex-grow">
                             <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-wider ml-1">{t('neg.doc_details_title')}</p>
                             <div className="border border-slate-200 rounded-xl overflow-hidden">
                                 <table className="w-full text-sm">
                                     <tbody className="divide-y divide-slate-100">
                                         {items.map((it, i) => (
                                             <tr key={i} className="bg-white">
                                                 <td className="py-3 px-4 text-slate-600 font-medium">{it.titulo}</td>
                                                 <td className="py-3 px-4 text-right font-mono text-slate-800">{formatMoney(it.valor)}</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                     <tfoot className="bg-slate-50 border-t border-slate-200">
                                         <tr>
                                             <td className="py-3 px-4 font-bold text-slate-500 text-xs uppercase">{t('common.subtotal')}</td>
                                             <td className="py-3 px-4 text-right font-bold text-slate-700">{formatMoney(total)}</td>
                                         </tr>
                                         {discAmount > 0 && (
                                             <tr className="text-emerald-600 bg-emerald-50/50">
                                                 <td className="py-2 px-4 font-bold text-xs uppercase">{t('neg.doc_discount')} ({discount}%)</td>
                                                 <td className="py-2 px-4 text-right font-bold">-{formatMoney(discAmount)}</td>
                                             </tr>
                                         )}
                                     </tfoot>
                                 </table>
                             </div>
                         </div>

                         <div className="bg-brand-dark text-white p-6 rounded-2xl flex justify-between items-center shadow-lg mt-4">
                             <span className="text-sm font-medium opacity-80">{t('neg.doc_final_val')}</span>
                             <span className="text-3xl font-bold tracking-tight">{formatMoney(finalAmount)}</span>
                         </div>

                         <div className="text-center text-[10px] text-slate-400 mt-2 italic">
                             {t('neg.doc_validity_text')}
                         </div>
                     </div>
                 )}
            </PreviewCard>

            <style>{`
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; font-size: 0.875rem; outline: none; transition: all 0.2s; color: #334155; }
                .input-field:focus { border-color: #E6007E; box-shadow: 0 0 0 3px rgba(230, 0, 126, 0.1); }
                .label-field { font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.25rem; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};

export default Negotiation;