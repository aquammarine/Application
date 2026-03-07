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
            className={`flex-col p-4 cursor-pointer group transition-all duration-300 min-h-[150px] ${today
                ? 'border-[#6366f1] border-2 shadow-sm shadow-indigo-100'
                : 'border-slate-100 hover:border-slate-200'
                } bg-white rounded-2xl`}
        >
            <div className="mb-2 shrink-0 px-1">
                <p className="font-extrabold text-[13px] mb-1 text-slate-900">
                    {format(day, 'EEE')}
                </p>
                <p className={`text-[15px] font-medium leading-none transition-colors duration-300 ${isSelected ? 'text-[#6366f1]' : 'text-slate-400'
                    } group-hover:text-indigo-600`}>
                    {format(day, 'd')}
                </p>
            </div>

            <div className="flex flex-col gap-2 w-full mt-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <CalendarEventPill
                            key={event.id}
                            event={event}
                            variant="block"
                            onClick={() => onEventClick(event.id)}
                        />
                    ))
                ) : (
                    <InfoItem text="No events" className="text-slate-400 font-bold text-[13px] mt-1" />
                )}
            </div>
        </Card>
    );
};

export { WeekDayCard };