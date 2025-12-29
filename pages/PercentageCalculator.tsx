import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CardProps {
    title: string;
    children: React.ReactNode;
    result: string;
    onCalc: () => void;
    onClear: () => void;
    icon: string;
    t: (key: string) => string;
}

const CalculatorCard: React.FC<CardProps> = ({ title, children, result, onCalc, onClear, icon, t }) => (
    <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-8 flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    {icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{title}</h3>
            </div>
            {children}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-end mb-5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('common.result')}</span>
                <span className="text-3xl font-bold text-brand-pink tracking-tight">{result}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={onClear} className="px-4 py-3 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition">{t('common.clear')}</button>
                <button onClick={onCalc} className="px-4 py-3 text-xs font-bold text-white bg-brand-pink rounded-xl hover:bg-brand-hover shadow-glow transition">{t('common.calculate')}</button>
            </div>
        </div>
    </div>
);

const PercentageCalculator: React.FC = () => {
    const { t } = useLanguage();

    // Calc 1: X% of Y
    const [c1_p, setC1_p] = useState('');
    const [c1_v, setC1_v] = useState('');
    const [res1, setRes1] = useState<string>('0.00');

    // Calc 2: X is what % of Y
    const [c2_v1, setC2_v1] = useState('');
    const [c2_v2, setC2_v2] = useState('');
    const [res2, setRes2] = useState<string>('0%');

    // Calc 3: Increase from X to Y
    const [c3_v1, setC3_v1] = useState('');
    const [c3_v2, setC3_v2] = useState('');
    const [res3, setRes3] = useState<string>('0%');

    const handleCalc1 = () => {
        const p = parseFloat(c1_p), v = parseFloat(c1_v);
        if (!isNaN(p) && !isNaN(v)) setRes1((v * (p / 100)).toFixed(2));
    };

    const handleCalc2 = () => {
        const v1 = parseFloat(c2_v1), v2 = parseFloat(c2_v2);
        if (!isNaN(v1) && !isNaN(v2) && v2 !== 0) setRes2(((v1 / v2) * 100).toFixed(2) + '%');
    };

    const handleCalc3 = () => {
        const v1 = parseFloat(c3_v1), v2 = parseFloat(c3_v2);
        if (!isNaN(v1) && !isNaN(v2) && v1 !== 0) setRes3((((v2 - v1) / v1) * 100).toFixed(2) + '%');
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-brand-pink">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-dark">{t('porc.title')}</h2>
                    <p className="text-slate-500 text-sm">{t('porc.subtitle')}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <CalculatorCard 
                    title={t('porc.c1_title')} 
                    result={`$ ${res1}`} 
                    onCalc={handleCalc1} 
                    onClear={() => { setC1_p(''); setC1_v(''); setRes1('0.00'); }}
                    icon="%"
                    t={t}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c1_label_p')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c1_p} onChange={e => setC1_p(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c1_label_v')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c1_v} onChange={e => setC1_v(e.target.value)} />
                        </div>
                    </div>
                </CalculatorCard>

                <CalculatorCard 
                    title={t('porc.c2_title')} 
                    result={res2} 
                    onCalc={handleCalc2} 
                    onClear={() => { setC2_v1(''); setC2_v2(''); setRes2('0%'); }}
                    icon="÷"
                    t={t}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c2_label_part')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c2_v1} onChange={e => setC2_v1(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c2_label_whole')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c2_v2} onChange={e => setC2_v2(e.target.value)} />
                        </div>
                    </div>
                </CalculatorCard>

                <CalculatorCard 
                    title={t('porc.c3_title')} 
                    result={res3} 
                    onCalc={handleCalc3} 
                    onClear={() => { setC3_v1(''); setC3_v2(''); setRes3('0%'); }}
                    icon="↗"
                    t={t}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c3_label_init')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c3_v1} onChange={e => setC3_v1(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('porc.c3_label_final')}</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center font-bold text-brand-dark outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/10 transition" value={c3_v2} onChange={e => setC3_v2(e.target.value)} />
                        </div>
                    </div>
                </CalculatorCard>
            </div>
        </div>
    );
};

export default PercentageCalculator;