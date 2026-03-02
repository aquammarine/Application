import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
} from 'lucide-react';
import { useCreateEventMutation } from './eventsApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import RadioGroup from '../../components/common/RadioGroup';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const [createEvent, { isLoading }] = useCreateEventMutation();

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

        if (formData.date && formData.time) {
            const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
            const now = new Date();
            if (combinedDateTime < now) {
                newErrors.date = 'Cannot create events in the past';
            }
        }

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
                title: formData.title,
                description: formData.description,
                location: formData.location,
                isPublic: formData.isPublic,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
                dateTime: combinedDateTime.toISOString(),
            };

            const result = await createEvent(payload).unwrap();
            navigate(`/events/${result.id}`);
        } catch (err: any) {
            setServerError(err.data?.message || 'Failed to create event. Please try again.');
        }
    };

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
                            <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight mb-2">Create New Event</h1>
                            <p className="text-slate-400 font-medium text-[15px]">Fill in the details to create an amazing event</p>
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
                                disabled={isLoading}
                                fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                fullWidth
                            >
                                Create Event
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
