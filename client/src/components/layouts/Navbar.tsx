import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, LogOut, User as UserIcon, Calendar, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import Button from '../common/Button';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50">
            <div className="px-8 flex items-center justify-end">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        <NavLink
                            to="/events"
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 text-[15px] font-bold transition-colors ${isActive ? 'text-slate-900 border-b-2 border-slate-900 py-1' : 'text-slate-500 hover:text-slate-900'
                                }`
                            }
                        >
                            <List size={20} className="text-slate-400" />
                            Events
                        </NavLink>
                        {user && (
                            <NavLink
                                to="/calendar"
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 text-[15px] font-bold transition-colors ${isActive ? 'text-slate-900 border-b-2 border-slate-900 py-1' : 'text-slate-500 hover:text-slate-900'
                                    }`
                                }
                            >
                                <Calendar size={20} className="text-slate-400" />
                                My Events
                            </NavLink>
                        )}
                    </div>


                    <div className="flex items-center gap-5">
                        {user ? (
                            <>
                                <Button
                                    onClick={() => navigate('/events/create')}
                                    icon={Plus}
                                    iconPosition="left"
                                    className="!rounded-xl !py-2.5 !px-5 !bg-[#6366F0] hover:!bg-indigo-600 !border-none !text-white font-bold shadow-sm shadow-[#6366F0]/10"
                                >
                                    Create Event
                                </Button>

                                <div className="h-6 w-[1px] bg-slate-200" />

                                <div className="flex items-center gap-5">
                                    <NavLink
                                        to="#"
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100">
                                            <UserIcon size={20} />
                                        </div>
                                        <span className="text-[15px] font-bold text-slate-700">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={22} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/login')}
                                    className="!rounded-xl !py-2.5 !px-6 border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => navigate('/register')}
                                    className="!rounded-xl !py-2.5 !px-6 !bg-indigo-600 hover:!bg-indigo-700 !border-none !text-white font-bold"
                                >
                                    Sign up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
