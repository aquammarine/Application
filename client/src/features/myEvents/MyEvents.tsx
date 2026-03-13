import React, { useState, useEffect } from 'react';
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
import { Plus } from 'lucide-react';
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
        </div>
    );
};

export { MyEvents };