import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import EventList from '../features/events/EventList';
import MyEvents from '../features/calendar/MyEvents';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/calendar" />} />
                    <Route path="/calendar" element={<MyEvents />} />
                    <Route path="/events" element={<EventList />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
