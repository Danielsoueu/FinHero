import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { language } = useLanguage();

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-medium text-xs">
            <span className="tabular-nums">{formatTime(time)}</span>
            <span className="opacity-30">|</span>
            <span>{formatDate(time)}</span>
        </div>
    );
};

export default Clock;
