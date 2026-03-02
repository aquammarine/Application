import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import EventList from '../features/events/EventList';
import EventDetails from '../features/events/EventDetails';
import CreateEvent from '../features/events/CreateEvent';
import EditEvent from '../features/events/EditEvent';
import MyEvents from '../features/calendar/MyEvents';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layouts/MainLayout';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<EventList />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetails />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/calendar" element={<MyEvents />} />
                        <Route path="/events/create" element={<CreateEvent />} />
                        <Route path="/events/:id/edit" element={<EditEvent />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
