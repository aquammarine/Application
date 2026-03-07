import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text: string;
    required?: boolean;
}

const Label: React.FC<LabelProps> = ({ text, required, className = '', ...props }) => {
    return (
        <label className={`text-md font-semibold text-slate-800 ml-0.5 flex items-center gap-1 ${className}`} {...props}>
            {text}
            {required && <span className="text-[#ef4444] text-base leading-none">*</span>}
        </label>
    );
};

export { Label };
