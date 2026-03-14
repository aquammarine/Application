import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import { Plus, Sparkles, X } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '../../components/common/Button';
import { WeekDayCard } from '../../components/calendar/WeekDayCard/WeekDayCard';
import '../../styles/calendar.css';
import { useEventsStore } from '../../stores/events.store';
import { Header } from '../../components/common';
import { CalendarToolbar } from '../../components/calendar/CalendarToolbar';
import { MyEventsEmpty } from '../../components/calendar/MyEventsEmpty';
import { CalendarEventPill } from '../../components/calendar/CalendarEventPill';
import { useAuthStore } from '../../stores/auth.store';
import type { Event } from '../../types/events.type';

const AssistantPanel = lazy(() => import('../../components/assistant/AssistantPanel/AssistantPanel').then(module => ({ default: module.AssistantPanel })));


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

function getEventColor(event: Event, isOrganizer: boolean): string {
    if (event.tags && event.tags.length > 0 && event.tags[0].tag.colorHex) {
        return event.tags[0].tag.colorHex;
    }
    return isOrganizer ? '#1D4ED8' : '#7C3AED';
}

const MyEvents: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const { myEvents, fetchMyEvents, isLoading } = useEventsStore();
    const [view, setView] = useState<View>(Views.WEEK);
    const [date, setDate] = useState(new Date());
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents]);

    const calendarEvents = myEvents.map((event: Event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.dateTime),
        end: new Date(new Date(event.dateTime).getTime() + 60 * 60 * 1000),
        allDay: false,
        resource: event,
        color: getEventColor(event, event.organizerId === currentUser?.id),
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

    if (myEvents.length === 0) {
        return (
            <MyEventsEmpty />
        );
    }

    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="h-full flex flex-col pt-6 pb-12 animate-in fade-in duration-500 overflow-hidden px-4 md:px-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <Header title="My Events" subtitle="View and manage your event calendar" />
                <Button variant="primary" onClick={() => navigate('/events/create')} icon={Plus}>Create Event</Button>
            </div>

            <CalendarToolbar
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onViewChange={setView}
            />

            <div className="flex-1 min-h-0 rbc-wrapper">
                {view === Views.MONTH ? (
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
                        eventPropGetter={(calEvent) => {
                            const color = getEventColor(calEvent.resource, calEvent.resource.organizerId === currentUser?.id);
                            return {
                                style: {
                                    backgroundColor: color,
                                    borderRadius: '4px',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '12px',
                                    padding: '2px 6px',
                                }
                            };
                        }}
                        formats={{
                            dateFormat: 'd',
                        }}
                        components={{
                            event: (props: any) => (
                                <CalendarEventPill
                                    {...props}
                                    onClick={() => handleSelectEvent(props.event)}
                                />
                            )
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 overflow-y-auto no-scrollbar pb-10">
                        {daysInWeek.map((day) => (
                            <WeekDayCard
                                key={day.toString()}
                                day={day}
                                selectedDate={date}
                                events={calendarEvents.filter((e: any) => isSameDay(e.start, day))}
                                onDayClick={setDate}
                                onEventClick={(eventId: string) => navigate(`/events/${eventId}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* AI Assistant Floating Widget */}
            {currentUser && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div
                        className={`transition-all duration-300 ease-in-out origin-bottom-right ${isAssistantOpen
                                ? 'w-[380px] sm:w-[440px] h-[540px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white opacity-100'
                                : 'w-14 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center opacity-100'
                            }`}
                        onClick={!isAssistantOpen ? () => setIsAssistantOpen(true) : undefined}
                    >
                        {isAssistantOpen ? (
                            <div className="flex flex-col h-full animate-in fade-in duration-300 delay-150 fill-mode-both">
                                <div className="bg-blue-600 p-4 text-white flex items-center justify-between rounded-t-2xl shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-blue-200" />
                                        <h2 className="font-semibold">Event Assistant</h2>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsAssistantOpen(false);
                                        }}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                                        aria-label="Close assistant"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden relative">
                                    <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-gray-50 flex items-center justify-center text-gray-400">Loading assistant...</div>}>
                                        <div className="absolute inset-0 [&>div]:h-full [&>div]:border-none [&>div]:rounded-none [&>div]:shadow-none">
                                            <AssistantPanel />
                                        </div>
                                    </Suspense>
                                </div>
                            </div>
                        ) : (
                            <Sparkles className="w-6 h-6 text-white animate-in zoom-in duration-200" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { MyEvents };