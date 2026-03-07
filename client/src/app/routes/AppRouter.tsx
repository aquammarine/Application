import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../../features/Login';
import { Register } from '../../features/Register';
import { MainLayout } from '../../components/layouts';
import { Events } from '../../features/Events';
import { EventDetails } from '../../components/EventDetails';
import ProtectedRoute from './ProtectedRoute';
import { MyEvents } from '../../features/myEvents';
import { CreateEvent } from '../../features/CreateEvent';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Events />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/calendar" element={<MyEvents />} />
                        <Route path="/events/create" element={<CreateEvent />} />
                        {/* <Route path="/events/:id/edit" element={<EditEvent />} /> */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
