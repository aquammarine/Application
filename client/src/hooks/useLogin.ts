import { useCallback, useState } from "react";
import authClient from "../api/auth-client";
import type { LoginData } from "../types/auth.types";


const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = useCallback(async (credentials: LoginData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authClient.post('/auth/login', credentials, {
                withCredentials: true,
            });

            return response.data;
        } catch (err: any) {
            setError(err.response?.data.message || 'Login failed');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleLogin, loading, error };
};

export { useLogin };