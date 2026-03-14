import React from 'react';
import { format } from 'date-fns';

interface CalendarEventPillProps {
    event: {
        id: string;
        title: string;
        start: Date;
        color?: string;
        onClick?: () => void;
    };
    onClick?: () => void;
    variant?: 'inline' | 'block';
}

const CalendarEventPill: React.FC<CalendarEventPillProps> = ({ event, onClick, variant = 'inline' }) => {
    const color = event.color || '#f2f2ff';
    const isCustomColor = !!event.color;
    
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        } else if (event.onClick) {
            event.onClick();
        }
    };

    if (variant === 'block') {
        return (
            <div
                onClick={handleClick}
                className={`w-full px-3 py-2 rounded-md transition-colors flex flex-col items-start gap-0.5 ${!isCustomColor ? 'bg-[#f2f2ff] hover:bg-indigo-100/40' : 'hover:opacity-80'}`}
                style={isCustomColor ? { backgroundColor: color } : {}}
            >
                <span 
                    className={`text-[11px] font-bold leading-tight ${!isCustomColor ? 'text-[#6366f1]' : ''}`}
                    style={isCustomColor ? { color: '#fff' } : {}}
                >
                    {format(event.start, 'HH:mm')}
                </span>
                <span 
                    className={`truncate w-full text-[11px] font-medium leading-tight mt-0.5 ${!isCustomColor ? 'text-[#7c83f2]' : ''}`}
                    style={isCustomColor ? { color: '#fff' } : {}}
                >
                    {event.title}
                </span>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={`w-full px-2 py-1 rounded-md border transition-colors flex items-center justify-start ${!isCustomColor ? 'bg-[#f2f2ff] border-indigo-50/50 hover:bg-indigo-100/40' : 'border-transparent hover:opacity-80'}`}
            style={isCustomColor ? { backgroundColor: color } : {}}
        >
            <span 
                className={`truncate text-[11px] font-bold leading-none ${!isCustomColor ? 'text-[#4f46e5]' : ''}`}
                style={isCustomColor ? { color: '#fff' } : {}}
            >
                {format(event.start, 'HH:mm')} - {event.title}
            </span>
        </div>
    );
};

export { CalendarEventPill };