import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
    return (
        <div className="h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 px-4 md:px-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
