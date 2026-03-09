import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initializeDatabase, addSampleData } from '../lib/initDatabase';
import { AuthProvider } from '../lib/AuthContext';

function App() {
  useEffect(() => {
    // Initialize database on app load
    const init = async () => {
      const isInitialized = await initializeDatabase();
      if (isInitialized) {
        // Add sample data if database is empty
        await addSampleData();
      }
    };
    init();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;