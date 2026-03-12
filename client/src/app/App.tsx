import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from '../stores/auth.store';
import { useTagsStore } from '../stores/tagsStore';
import '../index.css';

useTagsStore.getState().fetchTags();

function App() {
  const { fetchUser, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && user) {
      fetchUser();
    }
  }, [hasHydrated, fetchUser]);

  return (
    <AppRouter />
  );
}

export default App;
