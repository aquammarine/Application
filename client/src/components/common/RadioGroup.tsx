import React from 'react';

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
    onChange: (value: any) => void;
    error?: string;
    containerClassName?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    name,
    options,
    value,
    onChange,
    error,
    containerClassName = '',
}) => {
    return (
        <div className={`space-y-5 ${containerClassName}`}>
            {label && (
                <label className="text-[15px] font-bold text-slate-900 ml-0.5 block mb-2">
                    {label}
                </label>
            )}
            <div className="flex flex-col gap-2.5">
                {options.map((option) => (
                    <label
                        key={String(option.value)}
                        className="group flex items-center gap-3 cursor-pointer transition-all"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={String(option.value)}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="hidden"
                        />
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${value === option.value
                                ? 'border-[#6366F0] bg-[#6366F0]'
                                : 'border-slate-300 group-hover:border-slate-400 bg-white'
                                }`}
                        >
                            {value === option.value && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-700 text-[15px] leading-tight transition-colors group-hover:text-slate-900">{option.label}</span>
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
        </div>
    );
};

export default RadioGroup;
