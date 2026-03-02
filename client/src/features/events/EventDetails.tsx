import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronLeft, Clock, User as UserIcon, Loader2, Edit2, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useGetEventByIdQuery, useJoinEventMutation, useLeaveEventMutation, useDeleteEventMutation } from './eventsApi';
import { useAppSelector } from '../../app/hooks';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { accessToken, user: currentUser } = useAppSelector(state => state.auth);
    const isLoggedIn = !!accessToken;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: event, isLoading, error } = useGetEventByIdQuery(id!);
    const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
    const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
    const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-slate-500 font-bold">Loading event details...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-10 bg-red-50 rounded-[2.5rem] border border-red-100">
                <h3 className="text-xl font-bold text-red-900 mb-2">Event Not Found</h3>
                <p className="text-red-600 font-medium">The event you're looking for doesn't exist or was removed.</p>
                <Button variant="outline" onClick={() => navigate('/events')} className="mt-6">
                    Back to Events
                </Button>
            </div>
        );
    }

    const date = new Date(event.dateTime);
    const isOrganizer = currentUser?.id === event.organizerId;

    const handleDelete = async () => {
        try {
            await deleteEvent(id).unwrap();
            navigate('/events');
        } catch (err) {
            console.error('Failed to delete event:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-slate-800 font-bold text-sm hover:text-slate-900 transition-colors group"
                >
                    <ChevronLeft size={18} />
                    Back to Events
                </button>

                {isOrganizer && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/events/${id}/edit`)}
                            icon={Edit2}
                            iconPosition="left"
                            className="!rounded-xl border-slate-200 !py-2 !px-4 text-xs font-bold"
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(true)}
                            icon={Trash2}
                            iconPosition="left"
                            className="!rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 !py-2 !px-4 text-xs font-bold"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="h-48 sm:h-64 bg-indigo-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-90" />
                    <div className="relative z-10 px-6 sm:px-10 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Event Details
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            {event.title}
                        </h1>
                    </div>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                        <div className="flex-1 space-y-8">
                            <section>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">About the Event</h2>
                                <p className="text-slate-600 font-medium text-lg leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </section>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 flex-shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                        <p className="font-bold text-slate-800">{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Time</p>
                                        <p className="font-bold text-slate-800">{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 sm:col-span-2">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                        <p className="font-bold text-slate-800">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-80 flex flex-col gap-6">
                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Organizer</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                            <UserIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{event.organizer.firstName} {event.organizer.lastName}</p>
                                            <p className="text-xs text-slate-500 font-medium">{event.organizer.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Participants</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {event.participantCount} / {event.capacity || 'Unlimited'}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">People joined so far</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {isLoggedIn ? (
                                        !isOrganizer && (
                                            event.isJoined ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => leaveEvent(event.id)}
                                                    isLoading={isLeaving}
                                                    disabled={isJoining}
                                                    fullWidth
                                                    className="!rounded-2xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                                                >
                                                    Leave Event
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => joinEvent(event.id)}
                                                    isLoading={isJoining}
                                                    disabled={event.isFull || isLeaving}
                                                    fullWidth
                                                    className={`!rounded-2xl shadow-lg shadow-indigo-100 ${event.isFull ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {event.isFull ? 'Event Full' : 'Join Event'}
                                                </Button>
                                            )
                                        )
                                    ) : (
                                        <div className="text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-xs font-bold text-slate-500">Please login to join this event</p>
                                            <Button
                                                variant="outline"
                                                className="mt-3 !text-xs !py-2 !rounded-xl w-full"
                                                onClick={() => navigate('/login')}
                                            >
                                                Login
                                            </Button>
                                        </div>
                                    )}

                                    {isOrganizer && (
                                        <div className="text-center p-4 bg-indigo-50 rounded-2xl border border-dashed border-indigo-200">
                                            <p className="text-xs font-bold text-indigo-600">You are organizing this event</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default EventDetails;
