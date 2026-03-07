import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { InfoItem } from '../common/InfoItem';

interface CalendarEventPillProps {
    event: {
        id: string;
        title: string;
        start: Date;
        onClick?: () => void;
    };
    onClick?: () => void;
}

const CalendarEventPill: React.FC<CalendarEventPillProps> = ({ event, onClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        } else if (event.onClick) {
            event.onClick();
        }
    };

    return (
        <div onClick={handleClick} className="w-full">
            <InfoItem
                icon={Clock}
                text={`${format(event.start, 'HH:mm')} · ${event.title}`}
                className="truncate text-[#4f46e5] text-[11px]"
            />
        </div>
    );
};

export { CalendarEventPill };