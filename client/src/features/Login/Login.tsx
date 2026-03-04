import { Button, Input, Card } from "../../components/common/index";
import { AuthRedirect } from "../../components/AuthRedirect/index";
import { useLogin } from "../../hooks/useLogin";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginFormData } from "./login.schema";
import type { ZodError } from "zod";

const Login: React.FC = () => {
    const { handleLogin, loading } = useLogin();

    const [form, setForm] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        try {
            const validated = loginSchema.parse(form);
            await handleLogin(validated);
        } catch (err) {
            const zodError = err as ZodError;
            if (zodError.issues) {
                const errors: Partial<Record<keyof LoginFormData, string>> = {};
                zodError.issues.forEach((e) => {
                    const field = e.path[0] as keyof LoginFormData;
                    if (!errors[field]) errors[field] = e.message;
                });
                setFieldErrors(errors);
            }
        }
    };

    return (
        <form
            className="flex justify-center items-center h-screen"
            onSubmit={handleSubmit}
        >
            <Card className="w-full max-w-md p-10 flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <div className="gap-5 flex flex-col">
                    <Input
                        icon={Mail}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={fieldErrors.email}
                    />
                    <Input
                        icon={Lock}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        error={fieldErrors.password}
                    />
                </div>
                <Button disabled={loading} variant="primary" className="py-3">Login</Button>
                <AuthRedirect action="Sign Up" actionLink="/register">Don't have an account?</AuthRedirect>
            </Card>
        </form>
    );
};

export { Login };