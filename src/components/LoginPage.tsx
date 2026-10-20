import { useState } from 'react';
import { registerUser, loginUser, loginAdmin } from '../utils/storage';

interface LoginPageProps {
  onAdminLogin: () => void;
  onUserLogin: (userId: string) => void;
}

export default function LoginPage({ onAdminLogin, onUserLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    if (isAdmin) {
      if (loginAdmin(email, password)) {
        onAdminLogin();
      } else {
        setMessage('Credenciales de administrador incorrectas.');
        setMessageType('error');
      }
    } else {
      const result = loginUser(email, password);
      if (result.success && result.user) {
        onUserLogin(result.user.id);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setMessageType('error');
      return;
    }
    
    if (password.length < 4) {
      setMessage('La contraseña debe tener al menos 4 caracteres.');
      setMessageType('error');
      return;
    }

    const result = registerUser(email, razonSocial, password);
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    if (result.success) {
      setTimeout(() => {
        setMode('login');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Centro de Trabajo</h1>
          <p className="text-gray-500 mt-2">Sistema de Registro y Gestión</p>
        </div>

        {/* Toggle Admin/User */}
        <div className="flex bg-green-50 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsAdmin(false); setMessage(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !isAdmin ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            Usuario
          </button>
          <button
            onClick={() => { setIsAdmin(true); setMessage(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isAdmin ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            Administrador
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-green-100 rounded-2xl shadow-lg p-6">
          {/* Tabs Login/Register */}
          {!isAdmin && (
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => { setMode('login'); setMessage(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                  mode === 'login' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setMode('register'); setMessage(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                  mode === 'register' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${
              messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isAdmin ? 'Usuario' : 'Correo del Centro de Trabajo'}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAdmin ? 'administrador' : 'correo@ejemplo.com'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                {isAdmin ? 'Acceder como Administrador' : 'Iniciar Sesión'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && !isAdmin && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Correo del Centro de Trabajo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre o Razón Social
                </label>
                <input
                  type="text"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  placeholder="Nombre de la empresa"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita la contraseña"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Registrarse
              </button>
              <p className="text-xs text-gray-500 text-center">
                Su cuenta será revisada y aprobada por el administrador.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Sistema de Gestión de Centros de Trabajo - Venezuela
        </p>
      </div>
    </div>
  );
}
