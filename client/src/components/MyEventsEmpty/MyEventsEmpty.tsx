import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button, Card, Header } from '../common/';

const MyEventsEmpty: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto mt-20 text-center px-4">
            <Card className="flex-col items-center p-12 gap-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                    <CalendarIcon size={40} className="text-indigo-600" />
                </div>
                <Header
                    title="No events scheduled"
                    subtitle="You are not part of any events yet. Explore public events and join."
                    variant="md"
                    className="text-center"
                />
                <Button variant="primary" onClick={() => navigate('/events')}>
                    Explore Events
                </Button>
            </Card>
        </div>
    );
};

export { MyEventsEmpty };