import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'disabled' | 'danger' | 'chip';
    icon?: LucideIcon;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'secondary',
    icon: Icon,
    ...props
}) => {
    const hasCustomBorderColor = className.includes('border-');
    const hasCustomPadding = className.includes('p-') || className.includes('px-') || className.includes('py-');
    const baseStyles = `${hasCustomPadding ? '' : 'px-4 py-2'} rounded-md font-medium transition-all
                        focus:outline-none cursor-pointer border ${hasCustomBorderColor ? '' : 'border-transparent'}`;

    const variantStyles = {
        primary: "bg-[#6366F0] hover:bg-[#6366F0]/80 text-white",
        secondary: "bg-[#17A148] hover:bg-[#17A148]/80 text-white",
        ghost: "bg-opacity-0 hover:text-gray-900 text-gray-700",
        disabled: "bg-[#17A148]/50 text-white",
        danger: "bg-red-700 text-white hover:bg-red-600",
        chip: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 rounded-full text-sm",
    };

    return (
        <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
            <span className="flex items-center gap-2 justify-center">
                {Icon && <Icon size={18} />}{children}
            </span>
        </button>
    );
};

export { Button };
