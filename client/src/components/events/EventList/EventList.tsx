import { EventCard } from "../EventCard";
import { useEventsStore } from "../../../stores/events.store";
import { useAuthStore } from "../../../stores/auth.store";

interface EventListProps {
    searchQuery?: string;
    activeTags?: string[];
    onTagClick?: (tagId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ searchQuery = "", activeTags = [], onTagClick }) => {
    const { events, isLoading } = useEventsStore();
    const { user } = useAuthStore();

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = activeTags.length === 0 ||
            activeTags.every(tagId => event.tags?.some(et => et.tagId === tagId));
        return matchesSearch && matchesTags;
    });

    if (isLoading) {
        return (
            <div className="mt-8 flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            </div>
        );
    }

    if (filteredEvents.length === 0) {
        return (
            <div className="mt-8 py-12 text-center text-slate-500">
                No events found matching your criteria.
            </div>
        );
    }

    const eventsWithFormattedDate = filteredEvents.map((event) => {
        const dateObj = new Date(event.dateTime);
        const date = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const time = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return {
            ...event,
            date,
            time,
        };
    });

    return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {eventsWithFormattedDate.map((event) => (
                <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    participants={event._count?.participants || 0}
                    capacity={event.capacity || 0}
                    organizerId={event.organizerId}
                    isParticipant={event.participants?.some(p => p.user?.id === user?.id)}
                    tags={event.tags}
                    onTagClick={onTagClick}
                />
            ))}
        </div>
    );
};

export { EventList };
