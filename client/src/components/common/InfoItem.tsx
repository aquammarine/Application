import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface InfoItemProps {
    icon?: LucideIcon;
    text: string;
    className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, text, className = "" }) => {
    return (
        <div className={`flex items-center gap-2 text-slate-500 font-medium text-sm ${className}`}>
            {Icon && <Icon size={16} className="text-slate-400" />}
            <span>{text}</span>
        </div>
    );
};

export { InfoItem };
