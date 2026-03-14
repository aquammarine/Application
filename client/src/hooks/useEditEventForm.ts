import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsStore } from '../stores/events.store';
import { editEventSchema } from '../features/EditEvent/editEvent.schema';
import { tagsApi } from '../api/tags';
import type { EventFormFieldValues } from '../types/events.type';
import type { ZodError } from 'zod';

type FormFieldKeys = keyof EventFormFieldValues;

export const useEditEventForm = (id: string | undefined) => {
    const { currentEvent, fetchEventById, updateEvent } = useEventsStore();
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
    const [isLoading, setIsLoading] = useState(true);

    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [tagsError, setTagsError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchEventById(id).finally(() => setIsLoading(false));
        }
    }, [id, fetchEventById]);

    useEffect(() => {
        if (currentEvent && id === currentEvent.id) {
            const dateObj = new Date(currentEvent.dateTime);
            const date = dateObj.toISOString().split('T')[0];
            const time = dateObj.toTimeString().split(' ')[0].substring(0, 5);

            setForm({
                title: currentEvent.title,
                description: currentEvent.description,
                date,
                time,
                location: currentEvent.location,
                capacity: currentEvent.capacity?.toString() || '',
                isPublic: currentEvent.isPublic,
            });

            if (currentEvent.tags) {
                setSelectedTagIds(currentEvent.tags.map((et: { tagId: string }) => et.tagId));
            }
        }
    }, [currentEvent, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setFieldErrors({});
        setTagsError(null);

        try {
            const validated = editEventSchema.parse(form);
            const dateTime = new Date(`${validated.date}T${validated.time}`).toISOString();
            const capacityValue = validated.capacity === 0 || validated.capacity === undefined
                ? null
                : validated.capacity;

            setIsSubmitting(true);

            await updateEvent(id, {
                title: validated.title,
                description: validated.description,
                dateTime,
                location: validated.location,
                capacity: capacityValue as number | undefined,
                isPublic: validated.isPublic,
            });

            try {
                await tagsApi.updateEventTags(id, selectedTagIds);
            } catch (tagErr) {
                console.error("Failed to update tags:", tagErr);
                setTagsError("Changes saved but tags could not be updated.");
                setTimeout(() => {
                    navigate('/events/' + id);
                }, 3000);
                return;
            }

            navigate('/events/' + id);
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
                const apiErrorMessage = err?.response?.data?.message || err?.message || 'Failed to update event';
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
        isLoading,
        selectedTagIds,
        setSelectedTagIds,
        tagsError,
    };
};
