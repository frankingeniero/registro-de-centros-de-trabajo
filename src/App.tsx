import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import UserDashboard from './components/UserDashboard';

type View = 'login' | 'admin' | 'user';

function App() {
  const [view, setView] = useState<View>('login');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // Check if there's a saved session
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (session.type === 'admin') {
        setView('admin');
      } else if (session.type === 'user' && session.userId) {
        setView('user');
        setCurrentUserId(session.userId);
      }
    }
  }, []);

  const handleAdminLogin = () => {
    setView('admin');
    localStorage.setItem('currentSession', JSON.stringify({ type: 'admin' }));
  };

  const handleUserLogin = (userId: string) => {
    setCurrentUserId(userId);
    setView('user');
    localStorage.setItem('currentSession', JSON.stringify({ type: 'user', userId }));
  };

  const handleLogout = () => {
    setView('login');
    setCurrentUserId('');
    localStorage.removeItem('currentSession');
  };

  return (
    <>
      {view === 'login' && (
        <LoginPage onAdminLogin={handleAdminLogin} onUserLogin={handleUserLogin} />
      )}
      {view === 'admin' && (
        <AdminPanel onLogout={handleLogout} />
      )}
      {view === 'user' && (
        <UserDashboard userId={currentUserId} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
