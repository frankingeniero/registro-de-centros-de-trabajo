import { useState, useEffect } from 'react';
import { Usuario } from './types';
import { getSesion, getUsuarioPorId, inicializarAdmin } from './utils/storage';
import { isFirebaseReady, loadFirebaseConfig, initializeFirebase } from './utils/firebase';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import ConfigPanel from './components/ConfigPanel';

function App() {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // Intentar cargar configuración de Firebase guardada
    const config = loadFirebaseConfig();
    if (config) {
      initializeFirebase(config);
    }
    
    await inicializarAdmin();
    
    const sesion = getSesion();
    if (sesion) {
      const user = await getUsuarioPorId(sesion.usuarioId);
      if (user && user.estado === 'aprobado') {
        setUsuarioActual(user);
      }
    }
    setCargando(false);
  };

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

  // Panel de configuración de Firebase
  if (showConfig) {
    return <ConfigPanel onBack={() => setShowConfig(false)} onConfigured={() => { setShowConfig(false); window.location.reload(); }} />;
  }

  if (!usuarioActual) {
    return (
      <div>
        <LoginPage onLogin={handleLogin} />
        {/* Botón flotante para configurar Firebase */}
        <button
          onClick={() => setShowConfig(true)}
          className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow-lg hover:bg-gray-900 transition-all flex items-center gap-2 z-50"
          title="Configurar sincronización en la nube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          {isFirebaseReady() ? '🟢 Nube Activa' : '⚙️ Configurar Nube'}
        </button>
      </div>
    );
  }

  if (usuarioActual.rol === 'administrador') {
    return (
      <div>
        <AdminPanel onLogout={handleLogout} />
        {/* Botón flotante para configurar Firebase */}
        <button
          onClick={() => setShowConfig(true)}
          className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow-lg hover:bg-gray-900 transition-all flex items-center gap-2 z-50"
          title="Configurar sincronización en la nube"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          {isFirebaseReady() ? '🟢 Nube Activa' : '⚙️ Configurar Nube'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <UserDashboard usuario={usuarioActual} onLogout={handleLogout} />
      <button
        onClick={() => setShowConfig(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-full shadow-lg hover:bg-gray-900 transition-all flex items-center gap-2 z-50"
        title="Configurar sincronización en la nube"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        {isFirebaseReady() ? '🟢 Nube Activa' : '⚙️ Configurar Nube'}
      </button>
    </div>
  );
}

export default App;
