import { Button, Card, Header, InfoItem, Modal } from "../common";
import { ArrowLeft, CalendarDays, Clock, MapPin, User, Users, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventsStore } from "../../stores/events.store";
import { useJoinEvent } from "../../hooks/useJoinEvent";
import { useAuthStore } from "../../stores/auth.store";
import { ParticipantsList } from "../ParticipantsList";

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentEvent, fetchEventById, isLoading, error, deleteEvent } = useEventsStore();
    const { handleJoin, handleLeave, isPending } = useJoinEvent();
    const { user } = useAuthStore();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventById(id);
        }
    }, [id, fetchEventById]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50/50">
                <div className="text-indigo-600 font-medium">Loading event details...</div>
            </div>
        );
    }

    if (error || !currentEvent) {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-4 bg-slate-50/50">
                <div className="text-red-500 font-medium">{error || "Event not found"}</div>
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
    const isParticipant = currentEvent.participants?.some(p => p.user?.id === user?.id);
    const participants = currentEvent.participants || [];
    console.log('participants:', participants);

    const confirmDelete = async () => {
        if (!id) return;
        await deleteEvent(id);
        navigate('/calendar');
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50/50 py-8 px-4 gap-6">
            <div className="w-full max-w-5xl">
                <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card className="flex-col p-8 gap-6 bg-white shadow-sm">
                        <Header
                            title={currentEvent.title}
                            variant="lg"
                            className="w-full"
                        />

                        <div className="text-slate-600 leading-relaxed text-lg pb-6 border-b border-slate-100">
                            {currentEvent.description}
                        </div>

                        <ParticipantsList
                            participants={participants}
                            participantsCount={participantsCount}
                            organizerId={currentEvent.organizer?.id}
                        />
                    </Card>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="flex-col p-6 gap-6 bg-white shadow-sm sticky top-4">
                        <h2 className="text-lg font-bold text-slate-900">Event Details</h2>

                        <div className="flex flex-col gap-4">
                            <InfoItem icon={User} text={`Organizer: ${organizerName}`} />
                            <InfoItem icon={CalendarDays} text={formattedDate} />
                            <InfoItem icon={Clock} text={formattedTime} />
                            <InfoItem icon={MapPin} text={currentEvent.location} />
                            <InfoItem icon={Users} text={`${participantsCount} / ${currentEvent.capacity ?? 'Unlimited'} joined`} />
                        </div>

                        <div className="mt-2 flex flex-col gap-2">
                            {
                                currentEvent.organizer?.id === user?.id ? (
                                    <>
                                        <Button
                                            variant="primary"
                                            icon={Pencil}
                                            className="w-full"
                                            onClick={() => navigate(`/events/${currentEvent.id}/edit`)}
                                        >
                                            Edit Event
                                        </Button>
                                        <Button
                                            variant="danger"
                                            icon={Trash2}
                                            className="w-full"
                                            onClick={() => setIsDeleteModalOpen(true)}
                                        >
                                            Delete Event
                                        </Button>
                                    </>
                                ) : currentEvent.organizer?.id !== user?.id && isParticipant ? (
                                    <Button
                                        variant="danger"
                                        className="w-full"
                                        onClick={() => handleLeave(currentEvent.id)}
                                        disabled={isPending}
                                    >
                                        {isPending ? 'Leaving...' : 'Leave Event'}
                                    </Button>
                                ) : currentEvent.capacity && participantsCount >= currentEvent.capacity ? (
                                    <Button variant="disabled" className="w-full" disabled>
                                        Event Full
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => handleJoin(currentEvent.id)}
                                        disabled={isPending}
                                    >
                                        {isPending ? 'Joining...' : 'Join Event'}
                                    </Button>
                                )
                            }
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Event"
                confirmText="Delete Event"
                onConfirm={confirmDelete}
                isDanger
            >
                Are you sure you want to delete this event? This action is permanent and cannot be undone.
                All participants will be notified and this event will be removed from all calendars.
            </Modal>
        </div>
    );
};

export { EventDetails };