import { z } from 'zod';

export const editEventSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters'),
    description: z
        .string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters'),
    date: z
        .string()
        .min(1, 'Date is required'),
    time: z
        .string()
        .min(1, 'Time is required'),
    location: z
        .string()
        .min(1, 'Location is required')
        .min(3, 'Location must be at least 3 characters'),
    capacity: z
        .string()
        .transform((val) => (val === '' ? undefined : Number(val)))
        .pipe(
            z.number()
                .int('Capacity must be a whole number')
                .min(0, 'Capacity cannot be negative')
                .optional()
        ),
    isPublic: z
        .boolean()
        .default(true),
}).superRefine((data, ctx) => {
    const eventDate = new Date(`${data.date}T${data.time}`);

    if (isNaN(eventDate.getTime())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid date or time format',
            path: ['date'],
        });
    }

    
});

export type EditEventFormData = z.infer<typeof editEventSchema>;
