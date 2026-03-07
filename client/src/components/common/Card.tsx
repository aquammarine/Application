import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const baseStyles = "bg-white rounded-xl shadow-sm border flex flex-wrap";
    return (
        <div className={`${baseStyles} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export { Card };