import React from 'react';
import { format } from 'date-fns';

interface CalendarEventPillProps {
    event: {
        id: string;
        title: string;
        start: Date;
        onClick?: () => void;
    };
    onClick?: () => void;
    variant?: 'inline' | 'block';
}

const CalendarEventPill: React.FC<CalendarEventPillProps> = ({ event, onClick, variant = 'inline' }) => {
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
                className="w-full bg-[#f2f2ff] px-3 py-2 rounded-md hover:bg-indigo-100/40 transition-colors flex flex-col items-start gap-0.5"
            >
                <span className="text-[#6366f1] text-[11px] font-bold leading-tight">
                    {format(event.start, 'HH:mm')}
                </span>
                <span className="truncate w-full text-[#7c83f2] text-[11px] font-medium leading-tight mt-0.5">
                    {event.title}
                </span>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className="w-full bg-[#f2f2ff] px-2 py-1 rounded-md border border-indigo-50/50 hover:bg-indigo-100/40 transition-colors flex items-center justify-start"
        >
            <span className="truncate text-[#4f46e5] text-[11px] font-bold leading-none">
                {format(event.start, 'HH:mm')} - {event.title}
            </span>
        </div>
    );
};

export { CalendarEventPill };