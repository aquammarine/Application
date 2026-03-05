import { Card, Header, InfoItem, Button } from "../common";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useJoinEvent } from "../../hooks/useJoinEvent";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    participants: number;
    capacity: number;
    isJoined?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, description, date, time, location, participants, capacity, isJoined = false }) => {
    const { handleJoin, handleLeave, isPending } = useJoinEvent();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/events/${id}`);
    };

    return (
        <Card className="p-6 flex flex-col gap-2 w-full max-w-md rounded-2xl cursor-pointer" onClick={handleCardClick}>
            <Header
                title={title}
                subtitle={description}
                variant="sm"
            />

            <div className="flex flex-col gap-2.5 mt-2">
                <InfoItem icon={CalendarDays} text={date} />
                <InfoItem icon={Clock} text={time} />
                <InfoItem icon={MapPin} text={location} />
                <InfoItem icon={Users} text={`${participants} / ${capacity ?? 'Unlimited'} participants`} />
            </div>

            <hr className="border-slate-100" />

            {isJoined ? (
                <Button
                    variant="ghost"
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
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