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
    
    // Global State
    const [company, setCompany] = useState<Company | null>(null);
    const [clientName, setClientName] = useState('');
    const [items, setItems] = useState<DebtItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    // Form Configuration State
    const [multaRate, setMultaRate] = useState(DEFAULT_TAXA_MULTA);
    const [jurosRate, setJurosRate] = useState(DEFAULT_TAXA_JUROS);
    const [isRecurring, setIsRecurring] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Input State
    const [title, setTitle] = useState('');
    const [value, setValue] = useState<number | ''>(''); 
    const [dateDue, setDateDue] = useState(''); // Used as Start Date in Recurring
    const [dateEnd, setDateEnd] = useState(''); // Used only in Recurring
    const [datePaid, setDatePaid] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [discount, setDiscount] = useState('');

    // Helper: Calculate financials for a specific item
    const calculateItemValues = (
        valOriginal: number, 
        dtVenc: string, 
        dtPag: string, 
        paidCheck: boolean,
        taxaMulta: number,
        taxaJuros: number,
        descPorc: number
    ) => {
        let status: 'Vencida' | 'Não Vencida' | 'Pago' = "Não Vencida";
        let displayStatus = t('juros.status_ok');
        let vMulta = 0, vJuros = 0, vTotal = valOriginal, dias = 0;

        if (paidCheck) {
            status = "Pago";
            displayStatus = t('juros.status_paid');
        } else if (dtVenc) {
            // If datePaid is empty, assume today for calculation purposes if overdue
            const effectiveDatePaid = dtPag ? new Date(dtPag) : new Date();
            // Reset time needed for accurate day diff
            effectiveDatePaid.setHours(0,0,0,0);
            
            const dv = new Date(dtVenc);
            dv.setHours(0,0,0,0); // normalize timezone issues simple way

            // Only calculate if effective payment/current date is AFTER due date
            if (effectiveDatePaid > dv) {
                dias = Math.ceil((effectiveDatePaid.getTime() - dv.getTime()) / (1000 * 60 * 60 * 24));
                vMulta = valOriginal * (taxaMulta / 100);
                vJuros = (valOriginal * (taxaJuros / 100)) * dias;
                status = "Vencida";
                displayStatus = t('juros.status_overdue');
                vTotal = valOriginal + vMulta + vJuros;
            }
        }

        const vDesc = vTotal * (descPorc / 100);
        const vDevido = status === 'Pago' ? 0 : vTotal - vDesc;

        return { vMulta, vJuros, vTotal, vDevido, vDesc, status: displayStatus, dias };
    };

    const handleSave = () => {
        if (!company) return addToast(t('common.select_company'), 'error');
        const val = typeof value === 'string' ? parseFloat(value) : value;
        if (!val || isNaN(val)) return addToast('Por favor, informe um valor válido.', 'error');
        if (!dateDue) return addToast('Informe a data de vencimento.', 'error');

        const discVal = parseFloat(discount) || 0;

        // 1. EDIT MODE
        if (editingId) {
            const calculations = calculateItemValues(val, dateDue, datePaid, isPaid, multaRate, jurosRate, discVal);
            
            setItems(prev => prev.map(item => {
                if (item.id === editingId) {
                    return {
                        ...item,
                        titulo: title || item.titulo,
                        valorOriginal: val,
                        dataVencimento: dateDue,
                        dataPagamento: datePaid,
                        multa: calculations.vMulta,
                        juros: calculations.vJuros,
                        total: calculations.vTotal,
                        devido: calculations.vDevido,
                        desconto: calculations.vDesc,
                        status: calculations.status as any,
                        diasAtraso: calculations.dias
                    };
                }
                return item;
            }));
            addToast('Item atualizado com sucesso!', 'success');
            resetForm();
            return;
        }

        // 2. RECURRING MODE (Batch Add)
        if (isRecurring && dateEnd) {
            const startDate = new Date(dateDue);
            const endDate = new Date(dateEnd);
            // Adjust time to prevent timezone glitches
            startDate.setHours(12,0,0,0);
            endDate.setHours(12,0,0,0);

            if (endDate < startDate) return addToast('A data final deve ser maior que a inicial.', 'error');

            const newItems: DebtItem[] = [];
            let currentDate = new Date(startDate);
            let monthCount = 0;

            // Protection against infinite loops
            while (currentDate <= endDate && monthCount < 60) {
                const isoDate = currentDate.toISOString().split('T')[0];
                const calculations = calculateItemValues(val, isoDate, datePaid, isPaid, multaRate, jurosRate, discVal);

                // Format title (e.g., "Mensalidade - 05/2024")
                const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                const itemTitle = title ? `${title} - ${monthName}` : `Mensalidade ${monthName}`;

                newItems.push({
                    id: Date.now().toString() + Math.random().toString(),
                    titulo: itemTitle,
                    valorOriginal: val,
                    dataVencimento: isoDate,
                    dataPagamento: datePaid,
                    multa: calculations.vMulta,
                    juros: calculations.vJuros,
                    total: calculations.vTotal,
                    devido: calculations.vDevido,
                    desconto: calculations.vDesc,
                    status: calculations.status as any,
                    diasAtraso: calculations.dias
                });

                // Advance one month
                currentDate.setMonth(currentDate.getMonth() + 1);
                monthCount++;
            }

            setItems([...items, ...newItems]);
            addToast(`${newItems.length} faturas geradas com sucesso!`, 'success');
            resetForm();
            return;
        }

        // 3. SINGLE MODE (Standard Add)
        const calculations = calculateItemValues(val, dateDue, datePaid, isPaid, multaRate, jurosRate, discVal);
        setItems([...items, {
            id: Date.now().toString(),
            titulo: title || `Item #${items.length + 1}`,
            valorOriginal: val,
            dataVencimento: dateDue,
            dataPagamento: datePaid,
            multa: calculations.vMulta,
            juros: calculations.vJuros,
            total: calculations.vTotal,
            devido: calculations.vDevido,
            desconto: calculations.vDesc,
            status: calculations.status as any,
            diasAtraso: calculations.dias
        }]);
        
        addToast('Item adicionado à lista!', 'success');
        resetForm();
    };

    const handleEdit = (item: DebtItem) => {
        setEditingId(item.id);
        setTitle(item.titulo);
        setValue(item.valorOriginal);
        setDateDue(item.dataVencimento);
        setDatePaid(item.dataPagamento);
        setIsPaid(item.status === 'Pago' || item.status === 'Paid');
        const discountPerc = item.desconto > 0 ? ((item.desconto / item.total) * 100).toFixed(2) : '';
        setDiscount(discountPerc);
        setIsRecurring(false);
        setDateEnd('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        addToast('Editando item...', 'info');
    };

    const resetForm = () => {
        setTitle(''); setValue(''); setEditingId(null); setDateDue(''); setDateEnd('');
    };

    const handleGenerate = () => {
        if (!company || !clientName || items.length === 0) return addToast(t('common.preview_hint'), 'error');
        setShowResult(true);
        addToast('Resumo gerado com sucesso!', 'success');
    };

    const handleClearAll = () => {
        setItems([]); setShowResult(false); setClientName(''); resetForm();
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

                    <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm space-y-4 ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className={`text-sm font-bold uppercase tracking-wide ${editingId ? 'text-amber-600' : 'text-brand-dark'}`}>
                                {editingId ? 'Editando Fatura' : t('juros.new_item')}
                            </h3>
                            {editingId && <button onClick={resetForm} className="text-xs text-slate-400 hover:text-slate-600 underline">Cancelar Edição</button>}
                        </div>

                        {!editingId && (
                            <div className="flex p-1 bg-slate-100 rounded-xl mb-2">
                                <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isRecurring ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Cobrança Única</button>
                                <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isRecurring ? 'bg-white text-brand-pink shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Recorrência Mensal</button>
                            </div>
                        )}

                        <input className="input-field" placeholder={t('juros.title_placeholder')} value={title} onChange={e => setTitle(e.target.value)} />
                        <CurrencyInput className="input-field" placeholder={t('juros.val_placeholder')} value={value} onChange={setValue} />
                        
                        <div className={`grid gap-4 ${isRecurring ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <div><label className="label-field">{isRecurring ? 'Vencimento Inicial' : t('juros.due_date')}</label><input type="date" className="input-field" value={dateDue} onChange={e => setDateDue(e.target.value)} /></div>
                            {isRecurring && <div><label className="label-field">Data Limite (Final)</label><input type="date" className="input-field" value={dateEnd} onChange={e => setDateEnd(e.target.value)} /></div>}
                        </div>

                        {!isRecurring && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label-field">{t('juros.paid_date')}</label><input type="date" className="input-field" value={datePaid} onChange={e => setDatePaid(e.target.value)} /></div>
                                <div><label className="label-field">{t('juros.discount')}</label><input className="input-field text-center" type="number" placeholder="%" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                            </div>
                        )}

                        {!isRecurring && (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="relative flex items-center">
                                    <input type="checkbox" id="paid" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-brand-pink checked:bg-brand-pink" />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-xs">✔</span>
                                </div>
                                <label htmlFor="paid" className="text-sm font-medium text-slate-600 cursor-pointer select-none">{t('juros.is_paid')}</label>
                            </div>
                        )}

                        <button onClick={handleSave} className={`w-full py-3 rounded-xl font-bold transition shadow-lg text-white ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-dark hover:bg-slate-800'}`}>{editingId ? 'Salvar Alterações' : (isRecurring ? 'Gerar Faturas em Lote' : t('juros.add_btn'))}</button>
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item, idx) => (
                                <div key={item.id} className={`flex justify-between items-center p-3 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${editingId === item.id ? 'border-amber-400 ring-1 ring-amber-100' : 'border-slate-100'}`}>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-brand-dark truncate">{item.titulo}</span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">({new Date(item.dataVencimento).toLocaleDateString('pt-BR')})</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono text-slate-500">{formatCurrency(item.valorOriginal)}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === t('juros.status_overdue') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => handleEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-brand-pink hover:text-white transition"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                                        <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button onClick={handleGenerate} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('juros.generate_btn')}</button>
                        <button onClick={handleClearAll} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">{t('common.clean')}</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="juros-preview" hasContent={showResult}>
                {company && (
                    <div className="flex flex-col gap-5 text-sm font-sans">
                        <div className="flex flex-col items-center border-b border-slate-100 pb-6">
                            <img src={company.logoUrl} alt="Logo" className="max-h-24 w-auto mb-3 object-contain" />
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
                                        <span>Vencimento:</span><span className="text-right font-mono text-slate-700">{new Date(item.dataVencimento).toLocaleDateString('pt-BR')}</span>
                                        <span>{t('juros.label_original')}:</span><span className="text-right font-mono text-slate-700">{formatCurrency(item.valorOriginal)}</span>
                                        {item.status === t('juros.status_overdue') && <><span>{t('juros.label_fine_interest')} ({item.diasAtraso}d):</span><span className="text-right text-red-600 font-mono font-bold">+{formatCurrency(item.multa + item.juros)}</span></>}
                                        {item.desconto > 0 && <><span>{t('juros.label_discount')}:</span><span className="text-right text-green-600 font-mono font-bold">-{formatCurrency(item.desconto)}</span></>}
                                        <div className="col-span-2 border-t border-slate-100 mt-2 pt-2 flex justify-between font-bold text-brand-dark text-sm"><span>{t('juros.label_total_item')}:</span><span>{formatCurrency(item.devido)}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* 
                            IMPORTANT: Inline styles are used here to force the background and text color 
                            during PDF generation (html2canvas or Print), which often strip background colors.
                        */}
                        <div 
                            className="p-6 rounded-xl mt-4 flex justify-between items-center" 
                            style={{ 
                                backgroundColor: '#0F172A', 
                                color: '#ffffff', 
                                printColorAdjust: 'exact', 
                                WebkitPrintColorAdjust: 'exact',
                                border: '1px solid #0F172A'
                            }}
                        >
                            <span className="text-sm font-medium opacity-80" style={{ color: '#ffffff' }}>{t('juros.label_total_pay')}</span>
                            <span className="text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>{formatCurrency(totalDevido)}</span>
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