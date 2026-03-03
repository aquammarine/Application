import React from 'react';
import { Loader2, Search } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { useGetPublicEventsQuery, useJoinEventMutation, useLeaveEventMutation } from './eventsApi';
import EventCard from './components/EventCard';

const EventList: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { data: events, isLoading, error } = useGetPublicEventsQuery();
    const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
    const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();

    const { accessToken } = useAppSelector(state => state.auth);
    const isLoggedIn = !!accessToken;

    const filteredEvents = events?.filter((event: any) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-slate-500 font-bold">Discovering amazing events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-10 bg-red-50 rounded-[2.5rem] border border-red-100">
                <h3 className="text-xl font-bold text-red-900 mb-2">Oops!</h3>
                <p className="text-red-600 font-medium">Failed to load events. Please try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div className="py-10">
            <div className="flex flex-col gap-10 mb-14">
                <div className="space-y-3">
                    <h1 className="text-[42px] font-bold text-slate-900 tracking-tight leading-none">Discover Events</h1>
                    <p className="text-slate-400 text-[18px] font-medium leading-relaxed">Find and join exciting events happening around you</p>
                </div>

                <div className="relative max-w-[420px]">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search size={19} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-[14px] py-3.5 pl-14 pr-5 text-[16px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#6366F0]/5 focus:border-[#6366F0]/20 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    />
                </div>
            </div>

            {!filteredEvents || filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xl">
                        {searchQuery ? `No events found for "${searchQuery}"` : "No public events found."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event: any) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onJoin={(id) => joinEvent(id)}
                            onLeave={(id) => leaveEvent(id)}
                            isJoining={isJoining}
                            isLeaving={isLeaving}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
