import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, AlertCircle, User as UserIcon, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearError } from './authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/layouts/AuthLayout';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, accessToken } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken) {
            navigate('/calendar');
        }
        return () => {
            dispatch(clearError());
        };
    }, [accessToken, navigate, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email.includes('@') &&
        formData.password.length >= 6 &&
        formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...registerData } = formData;
        dispatch(register(registerData));
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join our platform and start managing your events"
            icon={UserPlus}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        icon={UserIcon}
                        placeholder="John"
                        required
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        icon={UserIcon}
                        placeholder="Doe"
                        required
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    placeholder="name@example.com"
                    required
                    fullWidth
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    placeholder="••••••••"
                    required
                    fullWidth
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={Lock}
                    placeholder="••••••••"
                    required
                    fullWidth
                    error={
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? 'Passwords do not match'
                            : undefined
                    }
                />

                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isFormValid}
                    icon={ArrowRight}
                    fullWidth
                    className="mt-4"
                >
                    Create Account
                </Button>
            </form>

            <p className="text-center mt-10 text-slate-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Register;
