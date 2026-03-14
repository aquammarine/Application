import { Button, Card, FormField } from "../../components/common/index";
import { AuthRedirect } from "../../components/auth/AuthRedirect/index";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";

import { useLoginForm } from "../../hooks/useLoginForm";

const Login: React.FC = () => {
    const { isLoading, user } = useAuthStore();
    const navigate = useNavigate();

    const { form, setForm, fieldErrors, handleSubmit } = useLoginForm();

    useEffect(() => {
        if (user) {
            navigate('/events', { replace: true });
        }
    }, [user, navigate]);

    return (
        <form
            className="flex justify-center items-center h-screen"
            onSubmit={handleSubmit}
        >
            <Card className="w-full max-w-md p-10 flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-center">Login</h1>

                <div className="gap-5 flex flex-col">
                    <FormField
                        id="email"
                        icon={Mail}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={fieldErrors.email}
                    />
                    <FormField
                        id="password"
                        icon={Lock}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        error={fieldErrors.password}
                    />
                </div>
                <Button disabled={isLoading} variant="primary" className="py-3">Login</Button>
                <AuthRedirect action="Sign Up" actionLink="/register">Don't have an account?</AuthRedirect>
            </Card>
        </form>
    );
};

export { Login };