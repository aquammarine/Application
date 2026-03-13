import { Card, Header, InfoItem, Button } from "../../common";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useJoinEvent } from "../../../hooks/useJoinEvent";
import { useAuthStore } from "../../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { useEventsStore } from "../../../stores/events.store";
import { EventTagList } from "../EventTagList/EventTagList";
import type { EventTag } from "../../../types/tag";

interface EventCardProps {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    participants: number;
    capacity: number;
    organizerId: string;
    isParticipant?: boolean;
    tags?: EventTag[];
    onTagClick?: (tagId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
    id,
    title,
    description,
    date,
    time,
    location,
    participants,
    capacity,
    organizerId,
    isParticipant: isParticipantProp,
    tags,
    onTagClick
}) => {
    const { handleJoin, handleLeave, isPending } = useJoinEvent();
    const { myEvents } = useEventsStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const isOrganizer = user?.id === organizerId;
    const isParticipant = isParticipantProp || myEvents.some(e => e.id === id);

    const handleCardClick = () => {
        navigate(`/events/${id}`);
    };

    return (
        <Card className="group p-6 flex flex-col gap-2 w-full rounded-2xl cursor-pointer" onClick={handleCardClick}>
            <Header
                title={title}
                subtitle={description}
                variant="sm"
                h1ClassName="transition-colors group-hover:text-[#6366F0]"
            />

            <div className="flex flex-col gap-2.5 mt-2">
                <InfoItem icon={CalendarDays} text={date} />
                <InfoItem icon={Clock} text={time} />
                <InfoItem icon={MapPin} text={location} />
                <InfoItem icon={Users} text={`${participants} / ${capacity > 0 ? capacity : 'Unlimited'} participants`} />
            </div>

            <EventTagList tags={tags} onTagClick={onTagClick} />

            <hr className="border-slate-200/60 mt-auto" />

            {isOrganizer ? (
                <Button
                    variant="primary"
                    className="w-full"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        navigate(`/events/${id}`);
                    }}
                >
                    Manage Event
                </Button>
            ) : isParticipant ? (
                <Button
                    variant="danger"
                    className="w-full"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleLeave(id);
                    }}
                    disabled={isPending}
                >
                    {isPending ? 'Leaving...' : 'Leave Event'}
                </Button>
            ) : capacity && participants >= capacity ? (
                <Button variant="disabled" className="w-full" disabled>
                    Event Full
                </Button>
            ) : (
                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        user ? handleJoin(id) : window.location.assign('/login');
                    }}
                    disabled={isPending}
                >
                    {isPending ? 'Joining...' : 'Join Event'}
                </Button>
            )}
        </Card>
    );
};

export { EventCard };