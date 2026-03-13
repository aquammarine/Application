import { useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Button, Card, FormField } from "../../components/common/index";
import { AuthRedirect } from "../../components/auth/AuthRedirect/index";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";

import { useRegisterForm } from "../../hooks/useRegisterForm";

const Register: React.FC = () => {
    const { isLoading, user } = useAuthStore();
    const navigate = useNavigate();

    const { form, setForm, fieldErrors, handleSubmit } = useRegisterForm();

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
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-xl text-gray-500 font-medium">Start your journey with us</p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <FormField
                            id="firstName"
                            icon={User}
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            label="First Name"
                            type="text"
                            placeholder="First Name"
                            error={fieldErrors.firstName}
                        />
                        <FormField
                            id="lastName"
                            icon={User}
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            label="Last Name"
                            type="text"
                            placeholder="Last Name"
                            error={fieldErrors.lastName}
                        />
                    </div>
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
                    <FormField
                        id="confirmPassword"
                        icon={Lock}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        error={fieldErrors.confirmPassword}
                    />
                </div>
                <Button disabled={isLoading} variant="primary" className="py-3">Register</Button>
                <AuthRedirect action="Login" actionLink="/login">Already have an account?</AuthRedirect>
            </Card>
        </form>
    );
};

export { Register };
