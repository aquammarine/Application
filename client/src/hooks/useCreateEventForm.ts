import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsStore } from '../stores/events.store';
import { createEventSchema } from '../features/CreateEvent/createEvent.schema';
import type { ZodError } from 'zod';

interface CreateEventForm {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
    isPublic: boolean;
}

type FormFieldKeys = keyof CreateEventForm;

export const useCreateEventForm = () => {
    const { createEvent } = useEventsStore();
    const navigate = useNavigate();

    const [form, setForm] = useState<CreateEventForm>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        isPublic: true,
    });

    const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormFieldKeys, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        try {
            const validated = createEventSchema.parse(form);

            const dateTime = new Date(`${validated.date}T${validated.time}`).toISOString();

            const capacityValue = validated.capacity === 0 || validated.capacity === undefined
                ? null
                : validated.capacity;

            setIsSubmitting(true);

            await createEvent({
                title: validated.title,
                description: validated.description,
                dateTime,
                location: validated.location,
                capacity: capacityValue as number | undefined,
                isPublic: validated.isPublic,
            });

            navigate('/events');
        } catch (err: any) {
            if (err?.name === 'ZodError') {
                const zodError = err as ZodError;
                const errors: Partial<Record<FormFieldKeys, string>> = {};
                zodError.issues.forEach((issue) => {
                    const field = issue.path[0] as FormFieldKeys;
                    if (!errors[field]) errors[field] = issue.message;
                });
                setFieldErrors(errors);
            } else {
                const apiErrorMessage = err?.response?.data?.message || err?.message || 'Failed to create event';
                setFieldErrors({ title: apiErrorMessage });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        setForm,
        fieldErrors,
        handleSubmit,
        isSubmitting,
    };
};
