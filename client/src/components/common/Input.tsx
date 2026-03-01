import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    fullWidth?: boolean;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    icon: Icon,
    error,
    fullWidth = false,
    containerClassName = '',
    className = '',
    ...props
}) => {
    const widthStyles = fullWidth ? 'w-full' : '';
    return (
        <div className={`space-y-2.5 ${widthStyles} ${containerClassName}`}>
            {label && (
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`w-full bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-200'
                        } text-slate-900 rounded-2xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'
                        } pr-4 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-300 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

export default Input;
