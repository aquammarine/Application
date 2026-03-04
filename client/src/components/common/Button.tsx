import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: LucideIcon;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'secondary',
    icon: Icon,
    ...props
}) => {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none cursor-pointer";

    const variantStyles = {
        primary: "bg-[#6366F0] hover:bg-[#6366F0]/80 text-white",
        secondary: "bg-[#17A148] hover:bg-[#17A148]/80 text-white",
        ghost: "bg-opacity-0 hover:text-gray-900 text-gray-700",
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
