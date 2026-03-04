import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    const baseStyles = "bg-white rounded-xl shadow-sm border border-slate-200/60";
    return (
        <div className={`${baseStyles} ${className}`}>
            {children}
        </div>
    );
};

export { Card };