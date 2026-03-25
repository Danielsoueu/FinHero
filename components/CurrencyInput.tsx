import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface CurrencyInputProps {
    value: number | '';
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, className }) => {
    const { currency } = useCurrency();

    const formatValue = (val: number | '') => {
        if (val === '') return '';
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code
        }).format(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove currency symbols, dots, and spaces, keep digits
        const rawValue = e.target.value.replace(/\D/g, '');
        
        if (rawValue === '') {
            onChange(0); // or handle as empty if preferred
            return;
        }

        // Convert to float (e.g. "1050" -> 10.50 if decimals=2, "1050" -> 1050 if decimals=0)
        const floatValue = parseFloat(rawValue) / Math.pow(10, currency.decimals);
        onChange(floatValue);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            className={className}
            placeholder={placeholder}
            value={formatValue(value)}
            onChange={handleChange}
        />
    );
};

export default CurrencyInput;