import React from 'react';
import { Label } from './Label';

interface RadioOption {
    label: string;
    value: string | boolean;
    description?: string;
}

interface RadioGroupProps {
    label?: string;
    name: string;
    options: RadioOption[];
    value: string | boolean;
    onChange: (value: string | boolean) => void;
    error?: string;
    required?: boolean;
    direction?: 'vertical' | 'horizontal';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    name,
    options,
    value,
    onChange,
    error,
    required = false,
    direction = 'vertical',
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label
                    text={label}
                    required={required}
                />
            )}

            <div className={`flex gap-2.5 ${direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'}`}>
                {options.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <label
                            key={String(option.value)}
                            className="group flex items-start gap-3 cursor-pointer transition-all"
                        >
                            <input
                                type="radio"
                                name={name}
                                value={String(option.value)}
                                checked={isSelected}
                                onChange={() => onChange(option.value)}
                                className="hidden"
                            />
                            <div
                                className={[
                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
                                    isSelected
                                        ? 'border-[#6366F0] bg-[#6366F0]'
                                        : 'border-slate-300 group-hover:border-slate-400 bg-white',
                                ].join(' ')}
                            >
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-700 text-[15px] leading-tight transition-colors group-hover:text-slate-900">
                                    {option.label}
                                </span>
                                {option.description && (
                                    <span className="text-xs text-slate-400 mt-0.5">{option.description}</span>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>

            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

export { RadioGroup };
