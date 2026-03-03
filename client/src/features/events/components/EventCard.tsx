import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Button from '../../../components/common/Button';

interface EventCardProps {
    event: {
        id: string;
        title: string;
        description: string;
        dateTime: string;
        location: string;
        capacity: number | null;
        participantCount: number;
        isJoined: boolean;
        isFull: boolean;
    };
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
    isJoining: boolean;
    isLeaving: boolean;
    isLoggedIn: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
    event,
    onJoin,
    onLeave,
    isJoining,
    isLeaving,
    isLoggedIn,
}) => {
    const navigate = useNavigate();
    const date = new Date(event.dateTime);

    const handleJoin = (e: React.MouseEvent) => {
        e.stopPropagation();
        onJoin(event.id);
    };

    const handleLeave = (e: React.MouseEvent) => {
        e.stopPropagation();
        onLeave(event.id);
    };

    return (
        <div
            onClick={() => navigate(`/events/${event.id}`)}
            className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 p-8 flex flex-col h-full cursor-pointer"
        >
            <div className="flex-1 space-y-4">
                <div className="space-y-2.5">
                    <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {event.title}
                    </h3>
                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed line-clamp-2 min-h-[42px]">
                        {event.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                    <div className="flex items-center gap-3 text-slate-500 text-[14px] font-medium">
                        <Calendar size={18} className="text-slate-400" />
                        <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[14px] font-medium">
                        <Clock size={18} className="text-slate-400" />
                        <span>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[14px] font-medium">
                        <MapPin size={18} className="text-slate-400" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[14px] font-medium">
                        <Users size={18} className="text-slate-400" />
                        <span>{event.participantCount} / {event.capacity || '∞'} participants</span>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                {isLoggedIn ? (
                    event.isJoined ? (
                        <Button
                            variant="outline"
                            onClick={handleLeave}
                            isLoading={isLeaving}
                            disabled={isJoining}
                            fullWidth
                            className="!py-3 !rounded-[10px] border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                        >
                            Leave Event
                        </Button>
                    ) : (
                        <Button
                            onClick={handleJoin}
                            isLoading={isJoining}
                            disabled={event.isFull || isLeaving}
                            fullWidth
                            className={`!py-3 !rounded-[10px] !bg-[#17A148] hover:!bg-[#108a40] !border-none text-white shadow-sm ${event.isFull ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {event.isFull ? 'Full' : 'Join Event'}
                        </Button>
                    )
                ) : (
                    <div className="text-center py-2.5 bg-slate-50 rounded-[10px] border border-dashed border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login to Join</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
