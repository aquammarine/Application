import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../../features/Login/index';
import { Register } from '../../features/Register/index';
import { MainLayout } from '../../components/layouts';
import { Events } from '../../features/Events/index'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Events />} />
                    <Route path="/events" element={<Events />} />
                    {/* <Route path="/events/:id" element={<EventDetails />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/calendar" element={<MyEvents />} />
                        <Route path="/events/create" element={<CreateEvent />} />
                        <Route path="/events/:id/edit" element={<EditEvent />} />
                    </Route> */}
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
