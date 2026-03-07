import React from 'react';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    h1ClassName?: string;
    variant?: "sm" | "md" | "lg";
}

const variantsConfig = {
    sm: {
        titleSize: "text-lg",
        subtitleSize: "text-sm mt-0.5 max-w-sm",
    },
    md: {
        titleSize: "text-2xl",
        subtitleSize: "text-base mt-1 max-w-md",
    },
    lg: {
        titleSize: "text-4xl",
        subtitleSize: "text-lg mt-2 max-w-lg",
    },
};

const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    variant = "lg",
    className = "",
    h1ClassName = "",
    ...props
}) => {
    return (
        <div className={`${className}`.trim()} {...props}>
            <h1 className={`${variantsConfig[variant].titleSize} font-bold text-gray-900 ${h1ClassName}`}>
                {title}
            </h1>
            {subtitle && (
                <p className={`${variantsConfig[variant].subtitleSize} text-gray-500`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export { Header };