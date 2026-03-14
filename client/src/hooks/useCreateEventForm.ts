import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsStore } from '../stores/events.store';
import { createEventSchema } from '../features/CreateEvent/createEvent.schema';
import { eventsApi } from '../api/eventsApi';
import { tagsApi } from '../api/tags';
import type { EventFormFieldValues } from '../types/events.type';
import type { ZodError } from 'zod';

type FormFieldKeys = keyof EventFormFieldValues;

export const useCreateEventForm = () => {
    const { fetchPublicEvents } = useEventsStore();
    const navigate = useNavigate();

    const [form, setForm] = useState<EventFormFieldValues>({
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

    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [tagsError, setTagsError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setTagsError(null);

        try {
            const validated = createEventSchema.parse(form);
            const dateTime = new Date(`${validated.date}T${validated.time}`).toISOString();
            const capacityValue = validated.capacity === 0 || validated.capacity === undefined
                ? null
                : validated.capacity;

            setIsSubmitting(true);

            const newEvent = await eventsApi.create({
                title: validated.title,
                description: validated.description,
                dateTime,
                location: validated.location,
                capacity: capacityValue as number | undefined,
                isPublic: validated.isPublic,
            });

            if (selectedTagIds.length > 0) {
                try {
                    await tagsApi.updateEventTags(newEvent.id, selectedTagIds);
                } catch (tagErr) {
                    console.error("Failed to update tags:", tagErr);
                    setTagsError("Event created but tags could not be saved. You can edit tags later.");
                    await fetchPublicEvents();
                    setTimeout(() => {
                        navigate('/events/' + newEvent.id);
                    }, 3000);
                    return;
                }
            }

            await fetchPublicEvents();
            navigate('/events/' + newEvent.id);
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
        setFieldErrors,
        handleSubmit,
        isSubmitting,
        setIsSubmitting,
        selectedTagIds,
        setSelectedTagIds,
        tagsError,
    };
};
