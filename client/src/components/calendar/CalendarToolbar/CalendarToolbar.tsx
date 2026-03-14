import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../common';
import { Views, type View } from 'react-big-calendar';
import { format } from 'date-fns';

interface CalendarToolbarProps {
    date: Date;
    view: View;
    onNavigate: (action: 'PREV' | 'NEXT') => void;
    onViewChange: (view: View) => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ date, view, onNavigate, onViewChange }) => {
    return (
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    icon={ChevronLeft}
                    onClick={() => onNavigate('PREV')}
                    className="w-9 h-9 p-0 border border-slate-100 shadow-sm bg-slate-50"
                />
                <h2 className="text-2xl font-black text-slate-900 px-4 min-w-[200px] text-center">
                    {format(date, 'MMMM yyyy')}
                </h2>
                <Button
                    variant="ghost"
                    icon={ChevronRight}
                    onClick={() => onNavigate('NEXT')}
                    className="w-9 h-9 p-0 border border-slate-100 shadow-sm bg-slate-50"
                />
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-2 p-1 rounded-xl">
                    <Button
                        variant={view === Views.MONTH ? 'primary' : 'ghost'}
                        onClick={() => onViewChange(Views.MONTH)}
                        className={view === Views.MONTH ? '' : 'border-slate-200'}
                    >
                        Month
                    </Button>
                    <Button
                        variant={view === Views.WEEK ? 'primary' : 'ghost'}
                        onClick={() => onViewChange(Views.WEEK)}
                        className={view === Views.WEEK ? '' : 'border-slate-200'}
                    >
                        Week
                    </Button>
                </div>
            </div>
        </div>
    );
};

export { CalendarToolbar };
