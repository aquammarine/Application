import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { Card } from '../common/Card';
import { InfoItem } from '../common/InfoItem';
import { CalendarEventPill } from '../CalendarEventPill';

interface WeekDayCardEvent {
    id: string;
    title: string;
    start: Date;
}

interface WeekDayCardProps {
    day: Date;
    selectedDate: Date;
    events: WeekDayCardEvent[];
    onDayClick: (day: Date) => void;
    onEventClick: (eventId: string) => void;
}

const WeekDayCard: React.FC<WeekDayCardProps> = ({ day, selectedDate, events, onDayClick, onEventClick }) => {
    const isSelected = isSameDay(day, selectedDate);
    const today = isToday(day);

    return (
        <Card
            onClick={() => onDayClick(day)}
            className={`flex-col p-5 cursor-pointer group ${today
                ? 'border-indigo-500 border-2'
                : 'border-slate-100'
                }`}
        >
            <div className="mb-6 shrink-0">
                <p className="font-bold text-[14px] mb-1 text-slate-800">
                    {format(day, 'EEE')}
                </p>
                <p className={`text-[28px] font-black leading-none transition-all duration-300 ${isSelected ? 'text-[#6366f1]' : 'text-slate-800'
                    } group-hover:text-indigo-600`}>
                    {format(day, 'd')}
                </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
                {events.length > 0 ? (
                    events.map((event) => (
                        <CalendarEventPill
                            key={event.id}
                            event={event}
                            onClick={() => onEventClick(event.id)}
                        />
                    ))
                ) : (
                    <InfoItem text="No events" className="text-slate-400 font-bold text-[14px]" />
                )}
            </div>
        </Card>
    );
};

export { WeekDayCard };