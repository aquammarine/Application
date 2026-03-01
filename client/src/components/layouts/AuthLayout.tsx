import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    icon: LucideIcon;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    icon: Icon,
}) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12">
            <div className="max-w-[500px] w-full">
                <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 mb-6 transform transition hover:scale-105 active:scale-95 cursor-default">
                            <Icon className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 text-center">
                            {title}
                        </h1>
                        <p className="text-slate-500 font-medium text-center">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
