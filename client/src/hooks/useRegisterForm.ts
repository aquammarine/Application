import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { registerSchema, type RegisterFormData } from '../features/Register/register.schema';
import type { ZodError } from 'zod';

export const useRegisterForm = () => {
    const { register } = useAuthStore();

    const [form, setForm] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        try {
            const { confirmPassword, ...validated } = registerSchema.parse(form);
            await register(validated);
        } catch (err: any) {
            if (err?.name === 'ZodError' || err?.issues) {
                const zodError = err as ZodError;
                const errors: Partial<Record<keyof RegisterFormData, string>> = {};
                zodError.issues.forEach((issue) => {
                    const field = issue.path[0] as keyof RegisterFormData;
                    if (!errors[field]) errors[field] = issue.message;
                });
                setFieldErrors(errors);
            } else {
                const apiErrorMessage = err?.response?.data?.message || err?.message || 'Registration failed';
                setFieldErrors({ email: apiErrorMessage });
            }
        }
    };

    return {
        form,
        setForm,
        fieldErrors,
        handleSubmit,
    };
};
