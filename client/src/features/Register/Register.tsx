import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Button, Input, Card } from "../../components/common/index";
import { AuthRedirect } from "../../components/AuthRedirect/index";
import { useRegister } from "../../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "./register.schema";
import type { ZodError } from "zod";

const Register: React.FC = () => {
    const { register, loading } = useRegister();

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
            const validated = registerSchema.parse(form);
            await register({
                name: `${validated.firstName} ${validated.lastName}`,
                email: validated.email,
                password: validated.password,
            });
        } catch (err) {
            const zodError = err as ZodError;
            if (zodError.issues) {
                const errors: Partial<Record<keyof RegisterFormData, string>> = {};
                zodError.issues.forEach((e) => {
                    const field = e.path[0] as keyof RegisterFormData;
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
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-xl text-gray-500 font-medium">Start your journey with us</p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <Input
                            icon={User}
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            label="First Name"
                            type="text"
                            placeholder="First Name"
                            error={fieldErrors.firstName}
                        />
                        <Input
                            icon={User}
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            label="Last Name"
                            type="text"
                            placeholder="Last Name"
                            error={fieldErrors.lastName}
                        />
                    </div>
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
                    <Input
                        icon={Lock}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        error={fieldErrors.confirmPassword}
                    />
                </div>
                <Button disabled={loading} variant="primary" className="py-3">Register</Button>
                <AuthRedirect action="Login" actionLink="/login">Already have an account?</AuthRedirect>
            </Card>
        </form>
    );
};

export { Register };
