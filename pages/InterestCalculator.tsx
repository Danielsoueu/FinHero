import React, { useState } from 'react';
import { Company, DebtItem } from '../types';
import { DEFAULT_TAXA_JUROS, DEFAULT_TAXA_MULTA } from '../constants';
import CompanySelector from '../components/CompanySelector';
import PreviewCard from '../components/PreviewCard';
import CurrencyInput from '../components/CurrencyInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

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

const InterestCalculator: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const { formatMoney } = useCurrency();
    
    const [company, setCompany] = useState<Company | null>(null);
    const [clientName, setClientName] = useState('');
    const [items, setItems] = useState<DebtItem[]>([]);
    const [showResult, setShowResult] = useState(false);

    const [multaRate, setMultaRate] = useState(DEFAULT_TAXA_MULTA);
    const [jurosRate, setJurosRate] = useState(DEFAULT_TAXA_JUROS);
    const [isRecurring, setIsRecurring] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [value, setValue] = useState<number | ''>(''); 
    const [dateDue, setDateDue] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [datePaid, setDatePaid] = useState(formatDateToISO(new Date()));
    const [isPaid, setIsPaid] = useState(false);
    const [discount, setDiscount] = useState('');

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
            const effectiveDatePaid = dtPag ? getSafeDate(dtPag) : new Date();
            effectiveDatePaid.setHours(12, 0, 0, 0);
            
            const dv = getSafeDate(dtVenc);
            dv.setHours(12, 0, 0, 0);

            if (effectiveDatePaid > dv) {
                const diffTime = effectiveDatePaid.getTime() - dv.getTime();
                dias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                if (dias > 0) {
                    vMulta = valOriginal * (taxaMulta / 100);
                    vJuros = (valOriginal * (taxaJuros / 100)) * dias;
                    status = "Vencida";
                    displayStatus = t('juros.status_overdue');
                    vTotal = valOriginal + vMulta + vJuros;
                }
            }
        }

        const vDesc = vTotal * (descPorc / 100);
        const vDevido = status === 'Pago' ? 0 : vTotal - vDesc;

        return { vMulta, vJuros, vTotal, vDevido, vDesc, status: displayStatus, dias };
    };

    const handleSave = () => {
        if (!company) return addToast(t('common.select_company'), 'error');
        const val = typeof value === 'string' ? parseFloat(value) : value;
        if (!val || isNaN(val)) return addToast('Informe um valor válido.', 'error');
        if (!dateDue) return addToast('Informe o vencimento.', 'error');

        const discVal = parseFloat(discount) || 0;

        if (editingId) {
            const calculations = calculateItemValues(val, dateDue, datePaid, isPaid, multaRate, jurosRate, discVal);
            setItems(prev => prev.map(item => item.id === editingId ? {
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
            } : item));
            addToast('Item atualizado!', 'success');
            resetForm();
            return;
        }

        if (isRecurring && dateEnd) {
            const startDateObj = getSafeDate(dateDue);
            const endDateObj = getSafeDate(dateEnd);
            
            if (endDateObj < startDateObj) return addToast('Data final deve ser após a inicial.', 'error');

            const targetDay = startDateObj.getDate();
            const newItems: DebtItem[] = [];
            let currentDate = new Date(startDateObj);
            let loopGuard = 0;

            while (currentDate <= endDateObj && loopGuard < 60) {
                const isoDate = formatDateToISO(currentDate);
                const calculations = calculateItemValues(val, isoDate, datePaid, isPaid, multaRate, jurosRate, discVal);
                const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                const itemTitle = title ? `${title} - ${monthName}` : `Mensalidade ${monthName}`;

                newItems.push({
                    id: Math.random().toString(36).substr(2, 9),
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

                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const nextMonthFirst = new Date(year, month + 1, 1, 12, 0, 0);
                const daysInNextMonth = new Date(year, month + 2, 0).getDate();
                nextMonthFirst.setDate(Math.min(targetDay, daysInNextMonth));
                currentDate = nextMonthFirst;
                loopGuard++;
            }

            setItems([...items, ...newItems]);
            addToast(`${newItems.length} faturas geradas!`, 'success');
            resetForm();
            return;
        }

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
        
        addToast('Adicionado!', 'success');
        resetForm();
    };

    const handleEdit = (item: DebtItem) => {
        setEditingId(item.id); 
        setTitle(item.titulo); 
        setValue(item.valorOriginal);
        setDateDue(item.dataVencimento); 
        setDatePaid(item.dataPagamento || formatDateToISO(new Date()));
        setIsPaid(item.status === t('juros.status_paid'));
        const dPerc = item.desconto > 0 ? ((item.desconto / item.total) * 100).toFixed(2) : '';
        setDiscount(dPerc); 
        setIsRecurring(false); 
        setDateEnd('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => { 
        setTitle(''); 
        setValue(''); 
        setEditingId(null); 
        setDateDue(''); 
        setDateEnd(''); 
        setDiscount(''); 
        setIsPaid(false); 
        setDatePaid(formatDateToISO(new Date())); 
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-hero border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('juros.title')}</h2>
                </div>
                
                <CompanySelector selected={company} onSelect={setCompany} />

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label-field">{t('common.client')}</label>
                            <input className="input-hero" placeholder={t('common.client_placeholder')} value={clientName} onChange={e => setClientName(e.target.value)} />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <label className="label-field">{t('juros.fine_rate')}</label>
                            <input type="number" className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white" value={multaRate} onChange={e => setMultaRate(parseFloat(e.target.value))} />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <label className="label-field">{t('juros.interest_rate')}</label>
                            <input type="number" step="0.01" className="input-hero bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white" value={jurosRate} onChange={e => setJurosRate(parseFloat(e.target.value))} />
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 transition-hero space-y-4 ${editingId ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {editingId ? 'Editando Fatura' : t('juros.new_item')}
                            </h3>
                            {editingId && <button onClick={resetForm} className="text-[10px] font-bold text-brand-pink hover:underline uppercase">Cancelar</button>}
                        </div>

                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                            <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${!isRecurring ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Única</button>
                            <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2 text-[11px] font-bold rounded-full transition-hero ${isRecurring ? 'bg-white dark:bg-slate-700 text-brand-pink shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>Recorrência</button>
                        </div>

                        <input className="input-hero" placeholder={t('juros.title_placeholder')} value={title} onChange={e => setTitle(e.target.value)} />
                        <CurrencyInput className="input-hero" placeholder={t('juros.val_placeholder')} value={value} onChange={setValue} />
                        
                        {!isRecurring && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <input type="checkbox" id="paid-chk" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-brand-pink focus:ring-brand-pink bg-white dark:bg-slate-800 cursor-pointer" />
                                <label htmlFor="paid-chk" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">{t('juros.is_paid')}</label>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="label-field">{t('juros.due_date')}</label><input type="date" className="input-hero" value={dateDue} onChange={e => setDateDue(e.target.value)} /></div>
                            {isRecurring ? (
                                <div><label className="label-field">Até quando?</label><input type="date" className="input-hero" value={dateEnd} onChange={e => setDateEnd(e.target.value)} /></div>
                            ) : (
                                <div>
                                    <label className="label-field">{isPaid ? t('juros.paid_date') : t('juros.calc_date')}</label>
                                    <input type="date" className="input-hero" value={datePaid} onChange={e => setDatePaid(e.target.value)} />
                                </div>
                            )}
                        </div>

                        {!isRecurring && (
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="label-field">{t('juros.discount')}</label>
                                    <input className="input-hero" type="number" placeholder="%" value={discount} onChange={e => setDiscount(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <button onClick={handleSave} className="w-full py-4 rounded-xl font-bold transition shadow-lg text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600">
                            {editingId ? 'Salvar Alterações' : (isRecurring ? 'Gerar Lote de Faturas' : 'Adicionar Fatura')}
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item, idx) => (
                                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-pink/30 dark:hover:border-brand-pink/30 transition-hero">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.titulo}</span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({item.dataVencimento.split('-').reverse().join('/')})</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                            {formatMoney(item.valorOriginal)} • 
                                            <span className={item.status === t('juros.status_overdue') ? 'text-red-500' : 'text-emerald-500'}> {item.status}</span>
                                            {item.status === t('juros.status_paid') && item.dataPagamento && (
                                                <span className="text-slate-400 dark:text-slate-500"> ({item.dataPagamento.split('-').reverse().join('/')})</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-pink hover:border-brand-pink transition-hero flex items-center justify-center">✎</button>
                                        <button onClick={() => setItems(items.filter(it => it.id !== item.id))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 transition-hero flex items-center justify-center">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setShowResult(true)} className="flex-1 py-4 bg-brand-pink text-white rounded-2xl font-bold hover:bg-brand-hover transition shadow-glow">{t('juros.generate_btn')}</button>
                        <button onClick={() => {setItems([]); setClientName(''); setShowResult(false);}} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">Limpar</button>
                    </div>
                </div>
            </div>

            <PreviewCard contentId="juros-preview" hasContent={showResult} clientName={clientName}>
                {company && (
                    <div className="flex flex-col gap-6 text-sm">
                        <div className="flex flex-col items-center border-b-2 border-slate-100 pb-8">
                            <img src={company.logoUrl} alt="Logo" className="max-h-20 w-auto mb-4 object-contain" />
                            <h2 className="font-black text-2xl text-slate-900">{company.nome}</h2>
                            <p className="text-[11px] font-black text-brand-pink uppercase tracking-[0.2em] mt-2">Demonstrativo de Débito</p>
                        </div>
                        <div className="flex justify-between items-end bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div><p className="text-[10px] uppercase font-black text-slate-400 mb-1">Cliente</p><p className="text-xl font-bold text-slate-900">{clientName || '---'}</p></div>
                            <div className="text-right"><p className="text-[10px] uppercase font-black text-slate-400 mb-1">Data</p><p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p></div>
                        </div>
                        <div className="space-y-4">
                            {items.map((item, i) => (
                                <div key={i} className="p-5 rounded-2xl border border-slate-100 relative overflow-hidden bg-white shadow-sm">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'Vencida' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                    <div className="flex justify-between items-center mb-4 pl-2">
                                        <span className="font-bold text-slate-900 text-base">{item.titulo}</span>
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${item.status === 'Vencida' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.status}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-xs pl-2 text-slate-600">
                                        <span>{t('juros.due_date')}</span><span className="text-right font-bold text-slate-900">{item.dataVencimento.split('-').reverse().join('/')}</span>
                                        {item.dataPagamento && item.status === t('juros.status_paid') && (
                                            <><span>{t('juros.paid_date')}</span><span className="text-right font-bold text-slate-900">{item.dataPagamento.split('-').reverse().join('/')}</span></>
                                        )}
                                        <span>{t('juros.label_original')}</span><span className="text-right font-bold text-slate-900">{formatMoney(item.valorOriginal)}</span>
                                        {item.diasAtraso > 0 && <><span>Multas/Juros ({item.diasAtraso}d)</span><span className="text-right text-red-600 font-bold">+{formatMoney(item.multa + item.juros)}</span></>}
                                        {item.desconto > 0 && <><span>Descontos</span><span className="text-right text-emerald-600 font-bold">-{formatMoney(item.desconto)}</span></>}
                                        <div className="col-span-2 border-t border-slate-100 mt-2 pt-2 flex justify-between font-black text-slate-900 text-sm">
                                            <span>Subtotal</span><span>{formatMoney(item.devido)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 rounded-[1.5rem] flex justify-between items-center bg-slate-900 text-white shadow-lg">
                            <span className="text-sm font-bold opacity-70">Total para Quitação</span>
                            <span className="text-3xl font-black">{formatMoney(items.reduce((a, b) => a + b.devido, 0))}</span>
                        </div>
                        <p className="text-center text-[10px] text-slate-400 mt-2">{t('common.doc_generated')}</p>
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

export default InterestCalculator;