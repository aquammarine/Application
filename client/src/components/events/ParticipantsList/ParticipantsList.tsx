import React from 'react';
import { Users } from "lucide-react";

interface ParticipantsListProps {
    participants: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    }[];
    participantsCount: number;
    organizerId?: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, participantsCount, organizerId }) => {
    return (
        <div className="mt-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="text-indigo-600" size={20} />
                Participants ({participantsCount})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {participants.length > 0 ? (
                    participants.map((p) => (
                        <div key={p.user?.id || Math.random()} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                {p.user?.firstName?.[0]}{p.user?.lastName?.[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">
                                    {p.user?.firstName} {p.user?.lastName}
                                </span>
                                {p.user?.id === organizerId && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Organizer</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 italic py-2">No participants yet. Be the first to join!</p>
                )}
            </div>
        </div>
    );
};

export { ParticipantsList };
