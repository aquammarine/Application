import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    icon: Icon,
    error,
    required = false,
    className = '',
    type,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;
    const hasIcon = !!Icon;

    return (
        <div className={`flex flex-col gap-1.5`}>
            {label && (
                <label className="text-sm font-bold text-slate-800 ml-0.5 flex items-center gap-1">
                    {label}
                    {required && <span className="text-[#ef4444] text-base leading-none">*</span>}
                </label>
            )}

            <div className="relative">
                {hasIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon size={18} />
                    </span>
                )}

                <input
                    type={resolvedType}
                    className={[
                        'w-full rounded-xl p-3 outline-none transition-all font-medium',
                        'bg-[#FCFCFD] border border-[#E5E7EB]',
                        'focus:bg-white focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/5',
                        'placeholder:text-slate-400/60',
                        hasIcon ? 'pl-10' : '',
                        isPassword ? 'pr-11' : '',
                        className,
                    ].join(' ')}
                    {...props}
                />

                {isPassword && (
                    <Button
                        type="button"
                        variant="ghost"
                        icon={showPassword ? EyeOff : Eye}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="!absolute !right-1 !top-1/2 !-translate-y-1/2 !p-2 !rounded-lg text-slate-400 hover:!text-slate-600"
                        tabIndex={-1}
                    />
                )}
            </div>

            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

export { Input };
