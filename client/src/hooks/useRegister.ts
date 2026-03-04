import { useCallback, useState } from "react";
import authClient from "../api/auth-client";
import type { RegisterPayload } from "../types/auth.types";

const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = useCallback(async (payload: RegisterPayload) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authClient.post('/auth/register', payload, {
                withCredentials: true,
            });

            console.log('Registration successful', response.data);
            return response.data;
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Registration failed. Please try again.';
            setError(Array.isArray(message) ? message[0] : message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { register, loading, error };
};

export { useRegister };
