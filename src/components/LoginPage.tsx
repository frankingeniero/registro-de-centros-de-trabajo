import { useState } from 'react';
import { login, registrarUsuario } from '../utils/storage';
import { Usuario } from '../types';

interface Props {
  onLogin: (usuario: Usuario) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [correoReg, setCorreoReg] = useState('');
  const [claveReg, setClaveReg] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' as 'exito' | 'error' | '' });
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    const resultado = await login(correo, clave);
    setCargando(false);
    if (resultado.exito && resultado.usuario) {
      onLogin(resultado.usuario);
    } else {
      setMensaje({ texto: resultado.mensaje, tipo: 'error' });
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (claveReg !== confirmarClave) {
      setMensaje({ texto: 'Las contraseñas no coinciden', tipo: 'error' });
      return;
    }
    if (claveReg.length < 5) {
      setMensaje({ texto: 'La contraseña debe tener al menos 5 caracteres', tipo: 'error' });
      return;
    }
    setCargando(true);
    const resultado = await registrarUsuario({
      correo: correoReg,
      razonSocial: razonSocial,
      clave: claveReg,
    });
    setCargando(false);
    setMensaje({ texto: resultado.mensaje, tipo: resultado.exito ? 'exito' : 'error' });
    if (resultado.exito) {
      setCorreoReg('');
      setRazonSocial('');
      setClaveReg('');
      setConfirmarClave('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700">Sistema de Registro</h1>
          <p className="text-gray-500 mt-1">Centros de Trabajo - Venezuela</p>
        </div>

        <div className="flex bg-green-50 rounded-xl p-1 mb-6">
          <button onClick={() => { setModo('login'); setMensaje({ texto: '', tipo: '' }); }} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${modo === 'login' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'}`}>Iniciar Sesión</button>
          <button onClick={() => { setModo('registro'); setMensaje({ texto: '', tipo: '' }); }} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${modo === 'registro' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'}`}>Registrarse</button>
        </div>

        {mensaje.texto && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{mensaje.texto}</div>
        )}

        {modo === 'login' && (
          <form onSubmit={handleLogin} className="bg-white border border-green-100 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <button type="submit" disabled={cargando} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md disabled:opacity-50">
              {cargando ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {modo === 'registro' && (
          <form onSubmit={handleRegistro} className="bg-white border border-green-100 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo del Centro de Trabajo</label>
              <input type="email" value={correoReg} onChange={e => setCorreoReg(e.target.value)} placeholder="centro@ejemplo.com" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre o Razón Social</label>
              <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} placeholder="Nombre del centro de trabajo" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={claveReg} onChange={e => setClaveReg(e.target.value)} placeholder="Mínimo 5 caracteres" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Contraseña</label>
              <input type="password" value={confirmarClave} onChange={e => setConfirmarClave(e.target.value)} placeholder="Repita la contraseña" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required />
            </div>
            <button type="submit" disabled={cargando} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md disabled:opacity-50">
              {cargando ? 'Registrando...' : 'Registrarse'}
            </button>
            <p className="text-xs text-gray-500 text-center">Su cuenta será aprobada por el administrador</p>
          </form>
        )}
      </div>
    </div>
  );
}
