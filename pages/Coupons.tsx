import React from 'react';
import { Ticket, Copy, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const Coupons: React.FC = () => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const mevCoupons = [
        { finance: 'PIXMEV', discount: '37,50%', when: 'Plano anual MEV via PIX (migração)', iugu: 'CP-2095C9 | Desconto 37% - PIXMEV', type: 'recurrent' },
        { finance: 'BOLETOCARTAOMEV', discount: '34,37%', when: 'Plano anual MEV via boleto/cartão (migração)', iugu: 'CP-14E57C | Desconto 35% - BOLETOCARTAOMEV', type: 'recurrent' },
        { finance: 'MENSALMEV', discount: '54%', when: 'Plano mensal MEV (migração)', iugu: 'CP-6D5AE8 | Desconto 54% - MENSALMEV', type: 'recurrent' },
        { finance: 'DESCONTOMEV25', discount: 'Flexível', when: 'Negociações fora dos padrões (MEV)', iugu: 'CP-4816E2 | Desconto 25% - DESCONTOMEV25', type: 'recurrent' },
    ];

    const heroCoupons = [
        { finance: 'RETEMHERO5', discount: '5%', when: 'Planos mensais e anuais', iugu: 'CP-A51DE0 | Desconto 5% - Desconto - Retenção', type: 'single' },
        { finance: 'RETEMHERO10', discount: '10%', when: 'Planos mensais e anuais', iugu: 'CP-9CB108 | Desconto 10% - Desconto - Renovação', type: 'single' },
        { finance: 'RETEMHERO15', discount: '15%', when: 'Clientes sem cupom ativo', iugu: 'CP-686412 | Desconto 15% - Desconto - Renovação', type: 'single' },
        { finance: 'RETEMHERO25', discount: '25%', when: 'Clientes sem cupom ativo', iugu: 'CP-6DADF1 | Desconto 25% - Desconto - Renovação', type: 'single' },
        { finance: 'RETEMHERO30', discount: '30%', when: 'Clientes sem cupom ativo', iugu: 'CP-A59AD5 | Desconto 30% - Desconto - Renovação', type: 'single' },
        { finance: 'RETEMHERO35', discount: '35%', when: 'Clientes sem cupom ativo', iugu: 'CP-CD0CD4 | Desconto 35% - Desconto - Renovação', type: 'single' },
        { finance: 'RETEMHERO58', discount: 'Flexível', when: 'Negociações fora dos padrões (Hero)', iugu: 'CP-9F8514 | RETEMHERO58', type: 'single' },
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            addToast(t('cupons.copied'), 'success');
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => {
            addToast(t('cupons.copy_error'), 'error');
        });
    };

    const CouponTable = ({ title, items, colorClass, icon: Icon }: { title: string, items: any[], colorClass: string, icon: any }) => (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 ${colorClass}`}>
                <Icon size={20} className="shrink-0" />
                <h2 className="font-black uppercase tracking-widest text-sm">{title}</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cupons.col_finance')}</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cupons.col_discount')}</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cupons.col_when')}</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('cupons.col_iugu')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {items.map((coupon, index) => (
                            <tr key={index} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleCopy(coupon.finance, `${title}-${index}-fin`)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-pink hover:text-white rounded-lg font-mono text-xs font-black transition-all"
                                    >
                                        {coupon.finance}
                                        {copiedId === `${title}-${index}-fin` ? <Check size={12} /> : <Copy size={12} className="opacity-40" />}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-black text-slate-900 dark:text-white text-sm">
                                        {coupon.discount}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {coupon.when}
                                        </p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${coupon.type === 'recurrent' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {coupon.type === 'recurrent' ? t('cupons.type_recurrent') : t('cupons.type_single')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleCopy(coupon.iugu, `${title}-${index}-iugu`)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-brand-pink rounded-lg text-[10px] font-black transition-all"
                                    >
                                        {coupon.iugu}
                                        {copiedId === `${title}-${index}-iugu` ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t('cupons.title')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {t('cupons.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <CouponTable 
                        title={t('cupons.mev_title')} 
                        items={mevCoupons} 
                        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100/50 dark:border-blue-500/20"
                        icon={Ticket}
                    />
                    <CouponTable 
                        title={t('cupons.hero_title')} 
                        items={heroCoupons} 
                        colorClass="bg-rose-50 text-brand-pink dark:bg-rose-500/10 dark:text-brand-pink border-rose-100/50 dark:border-rose-500/20"
                        icon={Ticket}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[2rem] text-white space-y-6 shadow-hero relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-brand-pink shrink-0" size={24} />
                            <h3 className="font-black uppercase tracking-widest text-sm">{t('cupons.rules_title')}</h3>
                        </div>
                        <ul className="space-y-4">
                            {[1, 2, 3].map(id => (
                                <li key={id} className="flex gap-3 items-start group/li">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0 group-hover/li:scale-125 transition-transform" />
                                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                                        {t(`cupons.rule_${id}`)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aprovação líder</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 italic">Edição de cupom flexível deve ser solicitada à liderança.</p>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-brand-pink/5 border border-brand-pink/10 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-glow">
                            <Check size={24} />
                        </div>
                        <p className="text-xs font-bold text-rose-900 dark:text-rose-200 leading-tight">
                            Cupons sem recorrência expiram automaticamente após a renovação.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coupons;
