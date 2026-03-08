import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'weekday' | 'none';
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
    const variantStyles = {
        default: "border border-slate-200/60",
        weekday: "border border-indigo-500",
        none: ""
    };

    const baseStyles = `bg-white rounded-xl shadow-sm flex flex-wrap ${variantStyles[variant]}`;
    return (
        <div className={`${baseStyles} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export { Card };