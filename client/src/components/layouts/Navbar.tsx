import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, LogOut, User as UserIcon, Calendar, List } from 'lucide-react';
import { Button } from '../common';
import { useAuthStore } from '../../stores/auth.store';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-[#6366F0]' : 'text-gray-600 hover:text-gray-900'
        }`;

    return (
        <nav className="bg-white border-b border-slate-100 px-8 py-3 sticky top-0 z-50 flex justify-between items-center">
            <div className="font-bold text-xl text-[#6366F0]"></div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                    <NavLink to="/events" className={navLinkClass}>
                        <List size={20} />
                        <span>Events</span>
                    </NavLink>

                    <NavLink to="/calendar" className={navLinkClass}>
                        <Calendar size={20} />
                        <span>My Events</span>
                    </NavLink>
                </div>

                <Button variant="primary" icon={Plus} onClick={() => navigate('/events/create')}>
                    Create Event
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#6366F0]/10 flex items-center justify-center text-[#6366F0]">
                        <UserIcon size={16} />
                    </div>
                    <span className="font-medium text-gray-700">{user?.firstName || 'User'}</span>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-gray-800 transition-colors ml-2 cursor-pointer focus:outline-none flex items-center justify-center"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export { Navbar };
