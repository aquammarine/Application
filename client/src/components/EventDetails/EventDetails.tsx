import { Button, Card, Header, InfoItem } from "../common";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Users } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventsStore } from "../../stores/events.store";
import { useJoinEvent } from "../../hooks/useJoinEvent";
import { useAuthStore } from "../../stores/auth.store";

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentEvent, fetchEventById, myEvents, isLoading, error } = useEventsStore();
    const { handleJoin, handleLeave, isPending } = useJoinEvent();
    const { user } = useAuthStore();

    useEffect(() => {
        if (id) {
            fetchEventById(id);
        }
    }, [id, fetchEventById]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Loading event details...</div>
            </div>
        );
    }

    if (error || !currentEvent) {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-4">
                <div className="text-red-500">{error || "Event not found"}</div>
                <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const dateObj = new Date(currentEvent.dateTime);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const organizerName = currentEvent.organizer
        ? `${currentEvent.organizer.firstName} ${currentEvent.organizer.lastName}`.trim()
        : 'Unknown';
    const participantsCount = currentEvent._count?.participants || 0;

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4">
            <div className="w-full max-w-4xl">
                <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
            </div>
            <Card className="pl-6 flex flex-col gap-2 w-full max-w-4xl rounded-2xl overflow-hidden">
                <div className="flex gap-4">
                    <Header
                        title={currentEvent.title}
                        subtitle={currentEvent.description}
                        variant="md"
                        className="w-2/3 mt-6"
                    />
                    <div className="flex flex-col gap-2 bg-slate-100 px-6 py-6 w-1/3">
                        <h1 className="font-bold text-gray-600 mb-2">Details:</h1>
                        <InfoItem icon={User} text={`Organizer: ${organizerName}`} />
                        <InfoItem icon={CalendarDays} text={formattedDate} />
                        <InfoItem icon={Clock} text={formattedTime} />
                        <InfoItem icon={MapPin} text={currentEvent.location} />
                        <InfoItem icon={Users} text={`${participantsCount} / ${currentEvent.capacity ?? 'Unlimited'} participants`} />

                        {
                            currentEvent.organizer?.id === user?.id ? (
                                <p className="w-full border border-gray-200 rounded-lg p-2 text-center font-semibold text-gray-600 mt-auto bg-neutral-50 px-6 py-2">You are the organizer</p>
                            ) : currentEvent.organizer?.id !== user?.id &&
                                myEvents.some(e => e.id === currentEvent.id) ? (
                                <Button
                                    variant="danger"
                                    className="mt-auto w-full"
                                    onClick={() => handleLeave(currentEvent.id)}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Leaving...' : 'Leave Event'}
                                </Button>
                            ) : currentEvent.capacity && participantsCount >= currentEvent.capacity ? (
                                <Button variant="disabled" className="mt-auto w-full" disabled>
                                    Event Full
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    className="mt-auto w-full"
                                    onClick={() => {
                                        handleJoin(currentEvent.id);
                                    }}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Joining...' : 'Join Event'}
                                </Button>
                            )
                        }
                    </div>
                </div>
            </Card>
        </div >
    );
};

export { EventDetails };