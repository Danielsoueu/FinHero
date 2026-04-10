import React from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const Coupons: React.FC = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const coupons = [
        { finance: 'RETEMHERO5', discount: '5%', iugu: 'CP-A51DE0 | Desconto 5% - Desconto - Retenção' },
        { finance: 'RETEMHERO10', discount: '10%', iugu: 'CP-9CB108 | Desconto 10% - Desconto - Renovação' },
        { finance: 'RETEMHERO15', discount: '15%', iugu: 'CP-686412 | Desconto 15% - Desconto - Renovação' },
        { finance: 'RETEMHERO25', discount: '25%', iugu: 'CP-6DADF1 | Desconto 25% - Desconto - Renovação' },
        { finance: 'RETEMHERO30', discount: '30%', iugu: 'CP-A59AD5 | Desconto 30% - Desconto - Renovação' },
        { finance: 'RETEMHERO35', discount: '35%', iugu: 'CP-CD0CD4 | Desconto 35% - Desconto - Renovação' },
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            showToast(t('cupons.copied'), 'success');
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => {
            showToast(t('cupons.copy_error'), 'error');
        });
    };

    return (
        <div className="flex flex-col h-full space-y-8">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t('cupons.title')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {t('cupons.subtitle')}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {t('cupons.col_finance')}
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {t('cupons.col_discount')}
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {t('cupons.col_iugu')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {coupons.map((coupon, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleCopy(coupon.finance, `fin-${index}`)}
                                            className="group flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg font-mono text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100 dark:border-rose-500/20"
                                        >
                                            {coupon.finance}
                                            {copiedId === `fin-${index}` ? <Check size={14} /> : <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {coupon.discount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleCopy(coupon.iugu, `iugu-${index}`)}
                                            className="group flex items-center justify-between w-full gap-4 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700/50 text-left"
                                        >
                                            <span className="truncate">{coupon.iugu}</span>
                                            {copiedId === `iugu-${index}` ? <Check size={14} className="flex-shrink-0 text-emerald-500" /> : <Copy size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Ticket size={20} />
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200/80 font-medium">
                    {t('cupons.subtitle')}
                </p>
            </div>
        </div>
    );
};

export default Coupons;
