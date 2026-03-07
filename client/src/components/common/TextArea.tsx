import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Label } from './Label';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    icon?: LucideIcon;
    error?: string;
    required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    icon: Icon,
    error,
    required = false,
    className = '',
    ...props
}) => {
    const hasIcon = !!Icon;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label
                    text={label}
                    required={required}
                />
            )}

            <div className="relative">
                {hasIcon && (
                    <span className="absolute left-3 top-4 text-slate-400 pointer-events-none">
                        <Icon size={18} />
                    </span>
                )}

                <textarea
                    className={[
                        'w-full rounded-xl p-3 outline-none transition-all font-medium resize-none min-h-[120px]',
                        'bg-[#FCFCFD] border border-[#E5E7EB]',
                        'focus:bg-white focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/5',
                        'placeholder:text-slate-400/60',
                        hasIcon ? 'pl-10' : '',
                        error ? 'border-red-300' : '',
                        className,
                    ].join(' ')}
                    {...props}
                />
            </div>

            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

export { TextArea };
