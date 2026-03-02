import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { useGetEventByIdQuery, useUpdateEventMutation } from './eventsApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import RadioGroup from '../../components/common/RadioGroup';

const EditEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: event, isLoading: isFetching, error: fetchError } = useGetEventByIdQuery(id!);
    const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        isPublic: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (event) {
            const dt = new Date(event.dateTime);
            const dateStr = dt.toISOString().split('T')[0];
            const timeStr = dt.toTimeString().split(' ')[0].substring(0, 5);

            setFormData({
                title: event.title,
                description: event.description,
                date: dateStr,
                time: timeStr,
                location: event.location,
                capacity: event.capacity?.toString() || '',
                isPublic: event.isPublic,
            });
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);

        if (!validate()) return;

        try {
            const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
            const payload = {
                id: id!,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                isPublic: formData.isPublic,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                dateTime: combinedDateTime.toISOString(),
            };

            await updateEvent(payload).unwrap();
            navigate(`/events/${id}`);
        } catch (err: any) {
            setServerError(err.data?.message || 'Failed to update event. Please try again.');
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-slate-500 font-bold">Loading event data...</p>
            </div>
        );
    }

    if (fetchError || !event) {
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

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-[640px] mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-8 hover:text-slate-900 transition-colors group"
                >
                    <ChevronLeft size={18} />
                    Back
                </button>

                <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10 sm:p-12">
                    <div className="mb-12 flex flex-col items-start">
                        <div className="flex flex-col items-center">
                            <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight mb-2">Edit Event</h1>
                            <p className="text-slate-400 font-medium text-[15px]">Update the details of your event</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {serverError && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold">
                                <p>{serverError}</p>
                            </div>
                        )}

                        <Input
                            label="Event Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Tech Conference 2025"
                            error={errors.title}
                            required
                            fullWidth
                        />

                        <TextArea
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what makes your event special..."
                            error={errors.description}
                            required
                            fullWidth
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input
                                label="Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                error={errors.date}
                                required
                                fullWidth
                            />
                            <Input
                                label="Time"
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                                error={errors.time}
                                required
                                fullWidth
                            />
                        </div>

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Convention Center, San Francisco"
                            error={errors.location}
                            required
                            fullWidth
                        />

                        <div className="space-y-1">
                            <Input
                                label="Capacity (optional)"
                                name="capacity"
                                type="number"
                                min="1"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Leave empty for unlimited"
                                fullWidth
                            />
                            <p className="text-[12px] text-slate-400 font-medium ml-0.5">
                                Maximum number of participants. Leave empty for unlimited capacity.
                            </p>
                        </div>

                        <RadioGroup
                            label="Visibility"
                            name="isPublic"
                            value={formData.isPublic}
                            onChange={(val) => setFormData(prev => ({ ...prev, isPublic: val }))}
                            options={[
                                {
                                    label: 'Public - Anyone can see and join this event',
                                    value: true,
                                },
                                {
                                    label: 'Private - Only invited people can see this event',
                                    value: false,
                                },
                            ]}
                            containerClassName="pt-2"
                        />

                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={isUpdating}
                                fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isUpdating}
                                fullWidth
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
