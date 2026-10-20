import { useState, useEffect } from 'react';
import { Usuario } from './types';
import { getSesion, getUsuarioPorId, inicializarAdmin } from './utils/storage';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    inicializarAdmin();
    const sesion = getSesion();
    if (sesion) {
      const user = getUsuarioPorId(sesion.usuarioId);
      if (user && user.estado === 'aprobado') {
        setUsuarioActual(user);
      }
    }
    setCargando(false);
  }, []);

  const handleLogin = (usuario: Usuario) => {
    setUsuarioActual(usuario);
  };

  const handleLogout = () => {
    setUsuarioActual(null);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuarioActual) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (usuarioActual.rol === 'administrador') {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return <UserDashboard usuario={usuarioActual} onLogout={handleLogout} />;
}

export default App;
