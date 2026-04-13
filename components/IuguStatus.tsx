import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface IuguStatusData {
    status: {
        indicator: 'none' | 'minor' | 'major' | 'critical';
        description: string;
    };
}

const IuguStatus: React.FC = () => {
    const [status, setStatus] = useState<IuguStatusData | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await fetch("https://status.iugu.com/api/v2/status.json");
            const data = await res.json();
            setStatus(data);
            setError(false);
        } catch (e) {
            console.error("Erro ao carregar status da Iugu:", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !status) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                <Activity size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Iugu Status...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-100 dark:border-rose-500/20">
                <AlertCircle size={12} className="text-rose-500" />
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tight">Status Indisponível</span>
            </div>
        );
    }

    const indicator = status?.status.indicator || 'none';
    const description = status?.status.description || '';

    const getStatusConfig = () => {
        switch (indicator) {
            case 'none':
                return {
                    icon: <CheckCircle2 size={12} className="text-emerald-500" />,
                    text: 'Iugu Online',
                    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                    border: 'border-emerald-100 dark:border-emerald-500/20',
                    textColor: 'text-emerald-600 dark:text-emerald-400'
                };
            case 'minor':
                return {
                    icon: <AlertTriangle size={12} className="text-amber-500" />,
                    text: 'Instabilidade',
                    bg: 'bg-amber-50 dark:bg-amber-500/10',
                    border: 'border-amber-100 dark:border-amber-500/20',
                    textColor: 'text-amber-600 dark:text-amber-400'
                };
            default:
                return {
                    icon: <AlertCircle size={12} className="text-rose-500" />,
                    text: 'Iugu com Problemas',
                    bg: 'bg-rose-50 dark:bg-rose-500/10',
                    border: 'border-rose-100 dark:border-rose-500/20',
                    textColor: 'text-rose-600 dark:text-rose-400'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div 
            className={`flex items-center gap-2 px-3 py-1.5 ${config.bg} ${config.border} rounded-lg border shadow-sm transition-all duration-300 hover:scale-105`}
            title={description}
        >
            {config.icon}
            <span className={`text-[10px] font-bold ${config.textColor} uppercase tracking-tight whitespace-nowrap`}>
                {config.text}
            </span>
        </div>
    );
};

export default IuguStatus;
