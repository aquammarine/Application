import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useShallow } from 'zustand/react/shallow';

const ProtectedRoute: React.FC = () => {
    const { user, isLoading, hasHydrated } = useAuthStore(useShallow(state => ({
        user: state.user,
        isLoading: state.isLoading,
        hasHydrated: state.hasHydrated,
    })));

    if (!user && !isLoading && hasHydrated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
