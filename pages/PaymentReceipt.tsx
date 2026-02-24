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

    const [desc, setDesc] = useState('');
    const [plan, setPlan] = useState('');
    const [method, setMethod] = useState('Pix');
    const [val, setVal] = useState<number | ''>('');

    // Recurrence states
    const [isRecurring, setIsRecurring] = useState(false);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    const getSafeDate = (dateString: string) => {
        if (!dateString) return new Date();
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day, 12, 0, 0);
    };

    const addItem = () => {
        if (!desc) return addToast('Informe a descrição.', 'error');
        const v = typeof val === 'string' ? parseFloat(val) : val;
        if (!v || isNaN(v)) return addToast('Informe um valor.', 'error');
        
        if (isRecurring) {
            if (!dateStart || !dateEnd) return addToast('Informe o período (início e fim).', 'error');
            
            const startDateObj = getSafeDate(dateStart);
            const endDateObj = getSafeDate(dateEnd);
            
            if (endDateObj < startDateObj) return addToast('Data final deve ser após a inicial.', 'error');

            const targetDay = startDateObj.getDate();
            const newItems: ReceiptItem[] = [];
            let currentDate = new Date(startDateObj);
            let loopGuard = 0;

            while (currentDate <= endDateObj && loopGuard < 60) {
                const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                // Capitalize first letter
                const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                const itemDesc = `${desc} - ${formattedMonth}`;

                newItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    descricao: itemDesc,
                    plano: plan,
                    formaPagamento: method,
                    valor: v
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
            addToast(`${newItems.length} itens adicionados!`, 'success');
            // Reset fields but keep recurrence mode if user wants to add more
            setDesc(''); setPlan(''); setVal('');
        } else {
            setItems([...items, { id: Math.random().toString(36).substr(2, 9), descricao: desc, plano: plan, formaPagamento: method, valor: v }]);
            setDesc(''); setPlan(''); setVal('');
            addToast('Item adicionado!', 'success');
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
        const newItems = [...items];
        const swapWith = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[swapWith]] = [newItems[swapWith], newItems[index]];
        setItems(newItems);
    };

    const formatMoney = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-hero border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('pag.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />
                
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Novo Item no Recibo</h3>
                    </div>

                    <div className="flex p-1 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700 mb-2">
                        <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${!isRecurring ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Único</button>
                        <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${isRecurring ? 'bg-slate-100 dark:bg-slate-700 text-brand-pink shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Recorrência</button>
                    </div>

                    <input className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" placeholder="O que está sendo pago? (ex: Mensalidade)" value={desc} onChange={e => setDesc(e.target.value)} />
                    
                    <div className="grid grid-cols-2 gap-3">
                         <input className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" placeholder="Plano" value={plan} onChange={e => setPlan(e.target.value)} />
                         <select className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" value={method} onChange={e => setMethod(e.target.value)}>
                            <option value="Pix">Pix</option>
                            <option value="Boleto">Boleto</option>
                            <option value="Cartão">Cartão</option>
                            <option value="Dinheiro">Dinheiro</option>
                         </select>
                    </div>

                    {isRecurring && (
                        <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <label className="label-field">Início (Mês Ref.)</label>
                                <input type="date" className="input-hero bg-slate-50 dark:bg-slate-800 border-none" value={dateStart} onChange={e => setDateStart(e.target.value)} />
                            </div>
                            <div>
                                <label className="label-field">Até quando?</label>
                                <input type="date" className="input-hero bg-slate-50 dark:bg-slate-800 border-none" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <CurrencyInput className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" placeholder="Valor (R$)" value={val} onChange={setVal} />
                    
                    <button onClick={addItem} className="w-full bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition shadow-lg">
                        {isRecurring ? 'Gerar Lote de Itens' : 'Adicionar à Lista'}
                    </button>
                </div>

                <div className="mb-8 space-y-3">
                    {items.length > 0 ? (
                        <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {items.map((item, idx) => (
                                <div key={item.id} className="flex items-center p-4 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-brand-pink/30 dark:hover:border-brand-pink/30 transition-hero group">
                                    <div className="flex flex-col gap-1 mr-4 shrink-0">
                                        <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-brand-pink dark:hover:text-brand-pink disabled:opacity-0 transition-hero">▲</button>
                                        <button onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-brand-pink dark:hover:text-brand-pink disabled:opacity-0 transition-hero">▼</button>
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.descricao}</p>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{item.plano || 'Geral'} • {item.formaPagamento}</p>
                                    </div>
                                    <div className="text-right ml-2 mr-4">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{formatMoney(item.valor)}</p>
                                    </div>
                                    <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-hero opacity-0 group-hover:opacity-100">✕</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-600">
                             <p className="text-xs font-bold uppercase tracking-widest">Lista vazia</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label-field">{t('common.client')}</label>
                            <input className="input-hero" placeholder="Nome Completo" value={client} onChange={e => setClient(e.target.value)} />
                        </div>
                        <div>
                            <label className="label-field">Data do Pagamento</label>
                            <input type="date" className="input-hero" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-field">Observações</label>
                            <textarea className="input-hero" rows={2} placeholder="Opcional..." value={obs} onChange={e => setObs(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="flex gap-4 pt-2">
                        <button onClick={() => setShowResult(true)} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">Gerar Recibo</button>
                        <button onClick={() => {setItems([]); setClient(''); setShowResult(false);}} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Limpar</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="receipt-preview" hasContent={showResult} clientName={client}>
                 {company && (
                     <div className="flex flex-col gap-8 font-sans">
                         <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8">
                             <div>
                                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">RECIBO</h2>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-1"># HERO-{Math.floor(Math.random() * 9000) + 1000}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Recebido</p>
                                 <p className="text-4xl font-black text-brand-pink tracking-tight">{formatMoney(items.reduce((s, i) => s + i.valor, 0))}</p>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-10 bg-slate-50 p-8 rounded-[1.5rem] border border-slate-100">
                             <div>
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">PAGO POR</p>
                                 <p className="font-bold text-slate-900 text-xl leading-tight">{client || '---'}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">DATA DA OPERAÇÃO</p>
                                 <p className="font-bold text-slate-900 text-lg">{date ? date.split('-').reverse().join('/') : new Date().toLocaleDateString()}</p>
                             </div>
                         </div>

                         <div className="mt-4">
                             <table className="w-full text-sm">
                                 <thead>
                                     <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-[0.1em]">
                                         <th className="text-left py-4 pl-4">Item / Descrição</th>
                                         <th className="text-left py-4">Plano</th>
                                         <th className="text-left py-4">Pagamento</th>
                                         <th className="text-right py-4 pr-4">Valor</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {items.map((it, i) => (
                                         <tr key={i} className="hover:bg-slate-50 transition-colors">
                                             <td className="py-5 pl-4 text-slate-900 font-bold">{it.descricao}</td>
                                             <td className="py-5 text-slate-500 font-medium">{it.plano || '---'}</td>
                                             <td className="py-5"><span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase">{it.formaPagamento}</span></td>
                                             <td className="py-5 pr-4 text-right font-black text-slate-900">{formatMoney(it.valor)}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>

                         {obs && (
                             <div className="bg-brand-pink/5 border border-brand-pink/10 p-5 rounded-2xl text-xs text-brand-pink mt-4">
                                 <strong className="uppercase font-black text-[10px] tracking-widest block mb-2 opacity-70">Nota Interna</strong>
                                 <p className="font-medium text-slate-700 leading-relaxed italic">{obs}</p>
                             </div>
                         )}

                         <div className="p-8 rounded-[2rem] mt-6 flex justify-between items-center bg-slate-900 text-white shadow-xl shadow-slate-200">
                             <span className="text-base font-bold opacity-70 tracking-wide uppercase">Valor Liquidado</span>
                             <span className="text-3xl font-black">{formatMoney(items.reduce((s, i) => s + i.valor, 0))}</span>
                         </div>

                         <div className="mt-10 flex items-center gap-6 p-6 border border-slate-100 rounded-3xl bg-slate-50/50">
                             <img src={company.logoUrl} className="max-h-16 w-auto object-contain" alt="logo" />
                             <div className="border-l border-slate-200 pl-6">
                                 <p className="font-black text-slate-900 text-base">{company.nome}</p>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Quitação Eletrônica</p>
                             </div>
                         </div>
                         <p className="text-center text-[10px] text-slate-400 mt-4">{t('common.doc_generated')}</p>
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

export default PaymentReceipt;