import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import {
    format,
    parse,
    startOfWeek,
    getDay,
    addMonths,
    subMonths,
    isSameDay,
    eachDayOfInterval,
    endOfWeek,
    addWeeks,
    subWeeks
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useGetMyEventsQuery } from '../events/eventsApi';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Button from '../../components/common/Button';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const MyEvents: React.FC = () => {
    const navigate = useNavigate();
    const { data: events = [], isLoading } = useGetMyEventsQuery();
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());

    const calendarEvents = events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.dateTime),
        end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000),
        allDay: false,
    }));

    const handleSelectEvent = (event: any) => {
        navigate(`/events/${event.id}`);
    };

    const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
        if (action === 'TODAY') {
            setDate(new Date());
        } else if (action === 'PREV') {
            setDate(view === Views.MONTH ? subMonths(date, 1) : subWeeks(date, 1));
        } else if (action === 'NEXT') {
            setDate(view === Views.MONTH ? addMonths(date, 1) : addWeeks(date, 1));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="max-w-4xl mx-auto mt-20 text-center px-4">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon size={40} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">No events scheduled</h2>
                <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                    You are not part of any events yet. Explore public events and join.
                </p>
                <Button onClick={() => navigate('/events')} className="!rounded-2xl !px-8">
                    Explore Events
                </Button>
            </div>
        );
    }

    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="h-full flex flex-col pt-6 pb-12 animate-in fade-in duration-500 overflow-hidden px-4 md:px-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-[34px] font-black text-slate-900 tracking-tight">My Events</h1>
                    <p className="text-slate-500 font-medium text-lg mt-1">View and manage your event calendar</p>
                </div>
            </div>

            <div className="mb-10 flex flex-col md:flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleNavigate('PREV')}
                            className="w-9 h-9 flex items-center justify-center hover:bg-white border border-slate-100 rounded-lg transition-all shadow-sm bg-slate-50 text-slate-400 hover:text-slate-900"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <h2 className="text-2xl font-black text-[#1e293b] px-4 min-w-[200px] text-center">
                            {format(date, 'MMMM yyyy')}
                        </h2>
                        <button
                            onClick={() => handleNavigate('NEXT')}
                            className="w-9 h-9 flex items-center justify-center hover:bg-white border border-slate-100 rounded-lg transition-all shadow-sm bg-slate-50 text-slate-400 hover:text-slate-900"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Button
                        onClick={() => navigate('/events/create')}
                        icon={Plus}
                        iconPosition="left"
                        className="!rounded-xl !py-2.5 !px-6 !bg-[#6366F0] hover:!bg-indigo-700 !border-none !text-white font-bold shadow-sm shadow-indigo-100"
                    >
                        Create Event
                    </Button>
                    <div className="flex items-center gap-2 p-1 rounded-xl">
                        <button
                            onClick={() => setView(Views.MONTH)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold ${view === Views.MONTH
                                ? 'bg-[#6366F0] text-white shadow-md shadow-indigo-100/50'
                                : 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView(Views.WEEK)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold ${view === Views.WEEK
                                ? 'bg-[#6366F0] text-white shadow-md shadow-indigo-100/50'
                                : 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                                }`}
                        >
                            Week
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {view === Views.MONTH ? (
                    <div className="h-full bg-white rounded-[32px] border border-slate-100 p-1 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto flex-1 outline-none no-scrollbar">
                            <div className="min-w-[900px] h-full">
                                <Calendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: '100%' }}
                                    onSelectEvent={handleSelectEvent}
                                    view={Views.MONTH}
                                    date={date}
                                    toolbar={false}
                                    eventPropGetter={() => ({
                                        style: {
                                            backgroundColor: '#f2f2ff',
                                            border: 'none',
                                            color: '#4f46e5',
                                            borderRadius: '8px',
                                            padding: '4px 10px',
                                            fontSize: '13px',
                                            fontWeight: '700'
                                        }
                                    })}
                                    components={{
                                        event: ({ event }: { event: any }) => (
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-[11px] font-black opacity-60">
                                                    {format(event.start, 'HH:mm')}
                                                </span>
                                                <span className="truncate">{event.title}</span>
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 overflow-y-auto no-scrollbar pb-10">
                        {daysInWeek.map((day) => {
                            const dayEvents = calendarEvents.filter((e: any) => isSameDay(e.start, day));
                            const isSelected = isSameDay(day, date);

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => setDate(day)}
                                    className={`bg-white rounded-[24px] border-2 p-5 transition-all duration-300 cursor-pointer flex flex-col group min-h-[140px] md:min-h-[160px] ${isSelected
                                        ? 'border-[#6366f1] shadow-2xl shadow-indigo-100/20'
                                        : 'border-slate-100 hover:border-indigo-100 hover:shadow-lg'
                                        }`}
                                >
                                    <div className="mb-6 shrink-0">
                                        <p className={`font-bold text-[14px] mb-1 ${isSelected ? 'text-slate-800' : 'text-slate-800'}`}>
                                            {format(day, 'EEE')}
                                        </p>
                                        <p className={`text-[28px] font-black leading-none ${isSelected ? 'text-[#6366f1]' : 'text-slate-800'}`}>
                                            {format(day, 'd')}
                                        </p>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-3">
                                        {dayEvents.length > 0 ? (
                                            dayEvents.map((event: any) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectEvent(event);
                                                    }}
                                                    className="bg-[#f2f2ff] p-4 rounded-[18px] border border-indigo-50/50 text-[#4f46e5] hover:bg-indigo-100/40 transition-colors shrink-0"
                                                >
                                                    <div className="flex gap-0.5">
                                                        <span className="text-xs font-black opacity-70 tracking-tight">
                                                            {format(event.start, 'HH:mm')}
                                                        </span>
                                                        <span className="text-xs font-black opacity-70 leading-tight truncate">
                                                            {` - ${event.title}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[14px] text-slate-400 font-bold mt-2">No events</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
                .rbc-calendar { font-family: inherit; border: none; height: 100%; outline: none; }
                .rbc-month-view { border: none; height: 100%; display: flex; flex-direction: column; overflow: hidden; border-radius: 32px; border: 1px solid #f1f5f9; }
                .rbc-month-row { flex: 1; border-top: 1px solid #f1f5f9 !important; border-left: none !important; }
                .rbc-header { 
                    padding: 20px 16px; 
                    font-weight: 800; 
                    color: #475569; 
                    text-transform: capitalize; 
                    font-size: 15px;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .rbc-header + .rbc-header { border-left: none !important; }
                .rbc-day-bg { border-left: 1px solid #f1f5f9 !important; transition: background 0.2s; }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9 !important; }
                .rbc-date-cell { padding: 14px 18px; font-weight: 800; color: #64748b; font-size: 16px; }
                .rbc-off-range-bg { background-color: #f8fafc; }
                .rbc-today { background-color: transparent; }
                .rbc-today .rbc-date-cell { color: #6366f1; position: relative; }
                .rbc-today .rbc-date-cell::after {
                    content: '';
                    position: absolute;
                    bottom: 12px; left: 18px; right: 18px; height: 2px;
                    background: #6366f1; border-radius: 4px;
                }
                .rbc-event { outline: none !important; padding: 0 !important; margin: 0 !important; }
                .rbc-event-content { padding: 0 !important; }
                .rbc-events-container { width: 100% !important; padding: 4px !important; }
                .rbc-row-segment { padding: 2px 4px !important; }

                /* Hide scrollbars but keep functionality */
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default MyEvents;
