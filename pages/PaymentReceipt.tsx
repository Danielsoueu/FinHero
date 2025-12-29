import React, { useState } from 'react';
import { Company, ReceiptItem } from '../types';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import CurrencyInput from '../components/CurrencyInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const PaymentReceipt: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [company, setCompany] = useState<Company | null>(null);
    const [client, setClient] = useState('');
    const [date, setDate] = useState('');
    const [obs, setObs] = useState('');
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    // Item form
    const [desc, setDesc] = useState('');
    const [plan, setPlan] = useState('');
    const [method, setMethod] = useState('Pix');
    const [val, setVal] = useState<number | ''>('');

    const addItem = () => {
        if (!desc) return addToast('Informe a descrição do item.', 'error');
        const valueNum = typeof val === 'string' ? parseFloat(val) : val;
        if (!valueNum || isNaN(valueNum)) return addToast('Informe um valor válido.', 'error');
        
        setItems([...items, {
            id: Date.now().toString(),
            descricao: desc,
            plano: plan,
            formaPagamento: method,
            valor: valueNum
        }]);
        setDesc(''); setPlan(''); setVal('');
        addToast('Item adicionado.', 'success');
    };

    const handleGenerate = () => {
        if (!company || !client || items.length === 0) return addToast(t('common.preview_hint'), 'error');
        setShowResult(true);
        addToast('Recibo gerado!', 'success');
    };

    const handleClear = () => {
        setItems([]); setShowResult(false); setClient(''); setObs('');
        addToast('Tudo limpo.', 'info');
    };

    const total = items.reduce((acc, i) => acc + i.valor, 0);
    const formatMoney = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-pink">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark">{t('pag.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('pag.add_item_title')}</h3>
                    <input className="input-sm" placeholder={t('pag.desc_placeholder')} value={desc} onChange={e => setDesc(e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                         <input className="input-sm" placeholder={t('pag.plan_placeholder')} value={plan} onChange={e => setPlan(e.target.value)} />
                         <select className="input-sm bg-white" value={method} onChange={e => setMethod(e.target.value)}>
                            <option value="Pix">{t('pag.method_pix')}</option>
                            <option value="Boleto">{t('pag.method_ticket')}</option>
                            <option value="Cartão">{t('pag.method_card')}</option>
                            <option value="Transferência">{t('pag.method_transfer')}</option>
                         </select>
                    </div>
                    <CurrencyInput 
                        className="input-sm" 
                        placeholder={t('pag.val_placeholder')} 
                        value={val} 
                        onChange={setVal} 
                    />
                    <button onClick={addItem} className="w-full bg-brand-dark text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg">{t('pag.add_list_btn')}</button>
                </div>

                <div className="mb-6 space-y-2">
                    {items.length > 0 ? items.map((item, idx) => (
                         <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                             <span className="font-medium text-slate-700">{item.descricao}</span>
                             <div className="flex items-center gap-3">
                                 <span className="font-bold text-brand-dark font-mono">{formatMoney(item.valor)}</span>
                                 <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="w-6 h-6 rounded bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold">×</button>
                             </div>
                         </div>
                    )) : <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">{t('pag.no_items')}</div>}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                        <label className="label-field">{t('common.client')}</label>
                        <input className="input-field" placeholder={t('common.client_placeholder')} value={client} onChange={e => setClient(e.target.value)} />
                    </div>
                    <div>
                        <label className="label-field ml-1">{t('pag.date_label')}</label>
                        <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="label-field">{t('common.obs_label')}</label>
                        <textarea className="input-field" rows={2} placeholder={t('pag.obs_placeholder')} value={obs} onChange={e => setObs(e.target.value)} />
                    </div>
                    
                    <div className="flex gap-4 pt-2">
                        <button onClick={handleGenerate} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('pag.generate_btn')}</button>
                        <button onClick={handleClear} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="receipt-preview" hasContent={showResult}>
                 {company && (
                     <div className="flex flex-col gap-6 font-sans">
                         <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                             <div>
                                 <h2 className="text-3xl font-black text-brand-dark tracking-tighter">{t('pag.doc_title')}</h2>
                                 <p className="text-sm text-slate-400 font-medium mt-1">DOC #{Date.now().toString().slice(-6)}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t('pag.doc_val_total')}</p>
                                 <p className="text-4xl font-bold text-brand-pink tracking-tight">{formatMoney(total)}</p>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-8 py-2 bg-slate-50 p-6 rounded-2xl">
                             <div>
                                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t('pag.doc_received_from')}</p>
                                 <p className="font-bold text-brand-dark text-lg leading-tight">{client}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{t('pag.doc_date')}</p>
                                 <p className="font-bold text-brand-dark">{date ? date.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR')}</p>
                             </div>
                         </div>

                         <div className="mt-2">
                             <table className="w-full text-sm">
                                 <thead>
                                     <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                                         <th className="text-left py-3 pl-2 font-bold">{t('pag.table_desc')}</th>
                                         <th className="text-left py-3 font-bold">{t('pag.table_plan')}</th>
                                         <th className="text-left py-3 font-bold">{t('pag.table_method')}</th>
                                         <th className="text-right py-3 pr-2 font-bold">{t('pag.table_val')}</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {items.map((it, i) => (
                                         <tr key={i}>
                                             <td className="py-4 pl-2 text-slate-800 font-semibold">{it.descricao}</td>
                                             <td className="py-4 text-slate-500">{it.plano}</td>
                                             <td className="py-4 text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{it.formaPagamento}</span></td>
                                             <td className="py-4 pr-2 text-right font-mono font-bold text-slate-800">{formatMoney(it.valor)}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>

                         {obs && (
                             <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-xs text-yellow-800 mt-2">
                                 <strong className="uppercase text-[10px] tracking-wide block mb-1 opacity-70">{t('common.obs_label')}</strong> {obs}
                             </div>
                         )}

                         <div className="mt-auto pt-10 flex items-center gap-4">
                             <img src={company.logoUrl} className="w-14 h-14 rounded-full object-contain" alt="logo" />
                             <div>
                                 <p className="font-bold text-sm text-brand-dark">{company.nome}</p>
                                 <p className="text-xs text-slate-500">{t('pag.doc_dept')}</p>
                             </div>
                             <div className="ml-auto text-[10px] text-slate-300 max-w-[200px] text-right italic leading-tight">
                                 {t('pag.doc_legal')}
                             </div>
                         </div>
                     </div>
                 )}
            </PreviewCard>

            <style>{`
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; font-size: 0.875rem; outline: none; transition: all 0.2s; color: #334155; }
                .input-field:focus { border-color: #E6007E; box-shadow: 0 0 0 3px rgba(230, 0, 126, 0.1); }
                .input-sm { width: 100%; padding: 0.6rem 0.8rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.8rem; outline: none; transition: all 0.2s; color: #334155; }
                .input-sm:focus { border-color: #E6007E; }
                .label-field { font-size: 0.75rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.25rem; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};

export default PaymentReceipt;