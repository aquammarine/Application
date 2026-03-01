import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from './authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthLayout from '../../components/layouts/AuthLayout';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Please enter your details to sign in"
            icon={LogIn}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    placeholder="name@example.com"
                    required
                    fullWidth
                />

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            Password
                        </label>
                        <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        placeholder="••••••••"
                        required
                        fullWidth
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    icon={ArrowRight}
                    fullWidth
                    className="mt-4"
                >
                    Sign In
                </Button>
            </form>

            <p className="text-center mt-10 text-slate-500 font-medium">
                New here?{' '}
                <Link to="/register" className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4">
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
