import React, { useState } from 'react';
import { Company, DebtItem } from '../types';
import { DEFAULT_TAXA_JUROS, DEFAULT_TAXA_MULTA } from '../constants';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import CurrencyInput from '../components/CurrencyInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const InterestCalculator: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [company, setCompany] = useState<Company | null>(null);
    const [clientName, setClientName] = useState('');
    const [items, setItems] = useState<DebtItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    // Form States
    const [multaRate, setMultaRate] = useState(DEFAULT_TAXA_MULTA);
    const [jurosRate, setJurosRate] = useState(DEFAULT_TAXA_JUROS);
    const [title, setTitle] = useState('');
    const [value, setValue] = useState<number | ''>(''); 
    const [dateDue, setDateDue] = useState('');
    const [datePaid, setDatePaid] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [discount, setDiscount] = useState('');

    const handleAdd = () => {
        if (!company) return addToast(t('common.select_company'), 'error');
        
        const val = typeof value === 'string' ? parseFloat(value) : value;
        if (!val || isNaN(val)) return addToast('Por favor, informe um valor válido.', 'error');

        let status: 'Vencida' | 'Não Vencida' | 'Pago' = "Não Vencida";
        let displayStatus = t('juros.status_ok');
        
        let vMulta = 0, vJuros = 0, vTotal = val, dias = 0;

        if (isPaid) {
            status = "Pago";
            displayStatus = t('juros.status_paid');
        } else if (dateDue && datePaid) {
            const dv = new Date(dateDue);
            const dp = new Date(datePaid);
            if (dp > dv) {
                dias = Math.ceil((dp.getTime() - dv.getTime()) / (1000 * 60 * 60 * 24));
                vMulta = val * (multaRate / 100);
                vJuros = (val * (jurosRate / 100)) * dias;
                status = "Vencida";
                displayStatus = t('juros.status_overdue');
                vTotal = val + vMulta + vJuros;
            }
        }

        const disc = parseFloat(discount) || 0;
        const vDesc = vTotal * (disc / 100);
        const vDevido = status === 'Pago' ? 0 : vTotal - vDesc;

        setItems([...items, {
            id: Date.now().toString(),
            titulo: title || `Item #${items.length + 1}`,
            valorOriginal: val,
            dataVencimento: dateDue,
            dataPagamento: datePaid,
            multa: vMulta,
            juros: vJuros,
            total: vTotal,
            devido: vDevido,
            desconto: vDesc,
            status: displayStatus as any,
            diasAtraso: dias
        }]);
        setTitle(''); setValue('');
        addToast('Item adicionado à lista!', 'success');
    };

    const handleGenerate = () => {
        if (!company || !clientName || items.length === 0) return addToast(t('common.preview_hint'), 'error');
        setShowResult(true);
        addToast('Resumo gerado com sucesso!', 'success');
    };

    const handleClear = () => {
        setItems([]); setShowResult(false); setClientName('');
        addToast('Campos limpos.', 'info');
    };

    const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const totalDevido = items.reduce((acc, item) => acc + item.devido, 0);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-pink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-brand-dark">{t('juros.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />

                <div className="space-y-6">
                    <div>
                        <label className="label-field">{t('common.client')}</label>
                        <input className="input-field" placeholder={t('common.client_placeholder')} value={clientName} onChange={e => setClientName(e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div>
                            <label className="label-field">{t('juros.fine_rate')}</label>
                            <input type="number" className="input-field bg-white" value={multaRate} onChange={e => setMultaRate(parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <label className="label-field">{t('juros.interest_rate')}</label>
                            <input type="number" step="0.01" className="input-field bg-white" value={jurosRate} onChange={e => setJurosRate(parseFloat(e.target.value))} />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                        <div className="flex justify-between items-center"><h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide">{t('juros.new_item')}</h3></div>
                        <input className="input-field" placeholder={t('juros.title_placeholder')} value={title} onChange={e => setTitle(e.target.value)} />
                        
                        {/* Currency Input Usage */}
                        <CurrencyInput 
                            className="input-field" 
                            placeholder={t('juros.val_placeholder')} 
                            value={value} 
                            onChange={setValue} 
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="label-field">{t('juros.due_date')}</label><input type="date" className="input-field" value={dateDue} onChange={e => setDateDue(e.target.value)} /></div>
                            <div><label className="label-field">{t('juros.paid_date')}</label><input type="date" className="input-field" value={datePaid} onChange={e => setDatePaid(e.target.value)} /></div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center">
                                    <input type="checkbox" id="paid" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-brand-pink checked:bg-brand-pink" />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-xs">✔</span>
                                </div>
                                <label htmlFor="paid" className="text-sm font-medium text-slate-600 cursor-pointer select-none">{t('juros.is_paid')}</label>
                            </div>
                            <input className="input-field w-24 text-center" type="number" placeholder={t('juros.discount')} value={discount} onChange={e => setDiscount(e.target.value)} title={t('juros.discount')} />
                        </div>

                        <button onClick={handleAdd} className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                            {t('juros.add_btn')}
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item, idx) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div>
                                        <span className="font-bold text-sm text-brand-dark">{item.titulo}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono text-slate-500">{formatCurrency(item.valorOriginal)}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === t('juros.status_overdue') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{item.status}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button onClick={handleGenerate} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('juros.generate_btn')}</button>
                        <button onClick={handleClear} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="juros-preview" hasContent={showResult}>
                {company && (
                    <div className="flex flex-col gap-5 text-sm font-sans">
                        <div className="flex flex-col items-center border-b border-slate-100 pb-6">
                            <img src={company.logoUrl} alt="Logo" className="h-20 w-auto mb-3 object-contain" />
                            <h2 className="font-bold text-xl text-brand-dark">{company.nome}</h2>
                            <p className="text-[10px] font-bold text-brand-pink uppercase tracking-widest mt-1">{t('juros.summary_title')}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400">{t('common.client')}</p>
                            <p className="text-lg font-bold text-brand-dark">{clientName}</p>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-100 relative overflow-hidden">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === t('juros.status_overdue') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    <div className="flex justify-between items-center mb-2 pl-2">
                                        <span className="font-bold text-slate-700">{item.titulo}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === t('juros.status_overdue') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{item.status}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-500 pl-2">
                                        <span>{t('juros.label_original')}:</span><span className="text-right font-mono text-slate-700">{formatCurrency(item.valorOriginal)}</span>
                                        {item.status === t('juros.status_overdue') && <><span>{t('juros.label_fine_interest')} ({item.diasAtraso}d):</span><span className="text-right text-red-600 font-mono font-bold">+{formatCurrency(item.multa + item.juros)}</span></>}
                                        {item.desconto > 0 && <><span>{t('juros.label_discount')}:</span><span className="text-right text-green-600 font-mono font-bold">-{formatCurrency(item.desconto)}</span></>}
                                        <div className="col-span-2 border-t border-slate-100 mt-2 pt-2 flex justify-between font-bold text-brand-dark text-sm"><span>{t('juros.label_total_item')}:</span><span>{formatCurrency(item.devido)}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-brand-dark text-white p-6 rounded-xl mt-4 flex justify-between items-center shadow-lg">
                            <span className="text-sm font-medium opacity-80">{t('juros.label_total_pay')}</span>
                            <span className="text-2xl font-bold tracking-tight">{formatCurrency(totalDevido)}</span>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-2">{t('common.doc_generated')} {t('common.validity')}</p>
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

export default InterestCalculator;