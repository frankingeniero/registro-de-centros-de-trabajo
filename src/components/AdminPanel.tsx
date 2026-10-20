import { useState, useEffect } from 'react';
import { Usuario, CentroTrabajo, Trabajador } from '../types';
import {
  getUsuarios, actualizarEstadoUsuario, resetearClave,
  getCentrosTrabajo, getTrabajadores, cerrarSesion,
  subscribeToUsuarios, subscribeToCentros, subscribeToTrabajadores, isCloudMode,
} from '../utils/storage';
import { exportarTodosRegistrosPDF, exportarTodosRegistrosExcel } from '../utils/exportUtils';

interface Props { onLogout: () => void; }

export default function AdminPanel({ onLogout }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [centros, setCentros] = useState<CentroTrabajo[]>([]);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [vista, setVista] = useState<'usuarios' | 'centros' | 'trabajadores'>('usuarios');
  const [showResetModal, setShowResetModal] = useState(false);
  const [usuarioReset, setUsuarioReset] = useState<Usuario | null>(null);
  const [nuevaClave, setNuevaClave] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' as 'exito' | 'error' | '' });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
    
    // Si está en modo nube, suscribirse a cambios en tiempo real
    if (isCloudMode()) {
      const unsub1 = subscribeToUsuarios((data) => {
        setUsuarios(data.filter(u => u.rol === 'usuario'));
      });
      const unsub2 = subscribeToCentros(setCentros);
      const unsub3 = subscribeToTrabajadores(setTrabajadores);
      
      return () => {
        unsub1?.();
        unsub2?.();
        unsub3?.();
      };
    }
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const allUsuarios = await getUsuarios();
    setUsuarios(allUsuarios.filter(u => u.rol === 'usuario'));
    setCentros(await getCentrosTrabajo());
    setTrabajadores(await getTrabajadores());
    setCargando(false);
  };

  const handleAprobar = async (id: string) => {
    await actualizarEstadoUsuario(id, 'aprobado');
    await cargarDatos();
    setMensaje({ texto: 'Usuario aprobado exitosamente', tipo: 'exito' });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  const handleSuspender = async (id: string) => {
    if (confirm('¿Está seguro de suspender este usuario?')) {
      await actualizarEstadoUsuario(id, 'suspendido');
      await cargarDatos();
      setMensaje({ texto: 'Usuario suspendido', tipo: 'exito' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    }
  };

  const handleReactivar = async (id: string) => {
    await actualizarEstadoUsuario(id, 'aprobado');
    await cargarDatos();
    setMensaje({ texto: 'Usuario reactivado', tipo: 'exito' });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  const handleResetClave = async () => {
    if (!usuarioReset || !nuevaClave) return;
    if (nuevaClave.length < 5) {
      setMensaje({ texto: 'La contraseña debe tener al menos 5 caracteres', tipo: 'error' });
      return;
    }
    await resetearClave(usuarioReset.id, nuevaClave);
    setShowResetModal(false);
    setUsuarioReset(null);
    setNuevaClave('');
    setMensaje({ texto: `Clave actualizada para ${usuarioReset.correo}`, tipo: 'exito' });
    await cargarDatos();
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  const handleLogout = () => { cerrarSesion(); onLogout(); };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado': return 'bg-green-100 text-green-700';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'suspendido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const pendientes = usuarios.filter(u => u.estado === 'pendiente').length;

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div><p className="mt-4 text-green-700">Cargando registros...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-green-700 to-emerald-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
            <div>
              <h1 className="text-lg font-bold">Panel de Administrador</h1>
              <p className="text-green-200 text-xs">
                {isCloudMode() ? '🟢 Sincronización en la nube ACTIVA - Tiempo real' : '🟡 Modo local'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => exportarTodosRegistrosPDF(centros, usuarios, trabajadores)} className="hidden md:flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all">📄 PDF</button>
            <button onClick={() => exportarTodosRegistrosExcel(centros, usuarios, trabajadores)} className="hidden md:flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-all">📊 Excel</button>
            <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Indicador de sincronización */}
      {isCloudMode() && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Sincronización en tiempo real activa</span>
            <span className="text-green-600">— Los datos se actualizan automáticamente desde todos los dispositivos conectados</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{usuarios.length}</p>
            <p className="text-sm text-gray-600">Usuarios</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-700">{pendientes}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{centros.length}</p>
            <p className="text-sm text-gray-600">Centros</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{trabajadores.length}</p>
            <p className="text-sm text-gray-600">Trabajadores</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          <button onClick={() => setVista('usuarios')} className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition-all ${vista === 'usuarios' ? 'bg-white text-green-700 border-b-2 border-green-600' : 'text-green-600 hover:bg-green-100'}`}>
            👥 Usuarios {pendientes > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{pendientes}</span>}
          </button>
          <button onClick={() => setVista('centros')} className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition-all ${vista === 'centros' ? 'bg-white text-green-700 border-b-2 border-green-600' : 'text-green-600 hover:bg-green-100'}`}>🏢 Centros de Trabajo</button>
          <button onClick={() => setVista('trabajadores')} className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition-all ${vista === 'trabajadores' ? 'bg-white text-green-700 border-b-2 border-green-600' : 'text-green-600 hover:bg-green-100'}`}>👷 Trabajadores</button>
        </div>
      </div>

      {mensaje.texto && (<div className="max-w-7xl mx-auto px-4 mt-4"><div className={`p-4 rounded-xl text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{mensaje.texto}</div></div>)}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Vista Usuarios */}
        {vista === 'usuarios' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-800">Gestión de Usuarios</h2>
              <div className="flex gap-2">
                <button onClick={() => exportarTodosRegistrosPDF(centros, usuarios, trabajadores)} className="md:hidden px-3 py-2 bg-red-500 text-white text-sm rounded-lg">📄 PDF</button>
                <button onClick={() => exportarTodosRegistrosExcel(centros, usuarios, trabajadores)} className="md:hidden px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg">📊 Excel</button>
                <button onClick={cargarDatos} className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                  🔄 Actualizar
                </button>
              </div>
            </div>
            {usuarios.length === 0 ? (
              <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100"><p className="text-gray-500">No hay usuarios registrados aún</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">Correo</th>
                      <th className="px-4 py-3 text-left text-sm">Razón Social</th>
                      <th className="px-4 py-3 text-left text-sm">Estado</th>
                      <th className="px-4 py-3 text-left text-sm">Registro</th>
                      <th className="px-4 py-3 text-center text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id} className="border-t border-green-50 hover:bg-green-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{u.correo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{u.razonSocial}</td>
                        <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(u.estado)}`}>{u.estado.charAt(0).toUpperCase() + u.estado.slice(1)}</span></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(u.fechaRegistro).toLocaleDateString('es-VE')}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1 flex-wrap">
                            {u.estado === 'pendiente' && <button onClick={() => handleAprobar(u.id)} className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">✓ Aprobar</button>}
                            {u.estado === 'aprobado' && <button onClick={() => handleSuspender(u.id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600">⏸ Suspender</button>}
                            {u.estado === 'suspendido' && <button onClick={() => handleReactivar(u.id)} className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">▶ Reactivar</button>}
                            <button onClick={() => { setUsuarioReset(u); setShowResetModal(true); }} className="px-3 py-1 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600">🔑 Clave</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Vista Centros */}
        {vista === 'centros' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-800">Todos los Centros de Trabajo Registrados</h2>
              <button onClick={cargarDatos} className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200">🔄 Actualizar</button>
            </div>
            {centros.length === 0 ? (
              <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100"><p className="text-gray-500">No hay centros de trabajo registrados</p></div>
            ) : (
              <div className="space-y-4">
                {centros.map(c => {
                  const trabsDelCentro = trabajadores.filter(t => t.centroTrabajoId === c.id);
                  const usuarioDelCentro = usuarios.find(u => u.id === c.usuarioId);
                  return (
                    <div key={c.id} className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
                      <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-green-800 text-lg">{c.razonSocial}</h3>
                            <p className="text-sm text-gray-600">RIF: {c.rif} | Tipo: {c.tipoCentro}</p>
                            {usuarioDelCentro && <p className="text-xs text-gray-500 mt-1">Usuario: {usuarioDelCentro.correo}</p>}
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                            {trabsDelCentro.length} trabajador(es)
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-semibold text-gray-700">📍 Ubicación:</p>
                            <p className="text-gray-600">{c.estado}, {c.municipio}, {c.parroquia}</p>
                            <p className="text-gray-600">{c.sector} {c.calle} {c.numeroLocal}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">👤 Persona a cargo:</p>
                            <p className="text-gray-600">{c.personaACargo.nombre} {c.personaACargo.apellido}</p>
                            <p className="text-gray-600">{c.personaACargo.cargo} - {c.personaACargo.cedula}</p>
                          </div>
                        </div>
                        {trabsDelCentro.length > 0 && (
                          <div className="mt-4">
                            <p className="font-semibold text-gray-700 text-sm mb-2">👷 Trabajadores:</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-green-50">
                                  <tr><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Cédula</th><th className="px-3 py-2 text-left">Cargo</th><th className="px-3 py-2 text-left">Ingreso</th></tr>
                                </thead>
                                <tbody>
                                  {trabsDelCentro.map(t => (
                                    <tr key={t.id} className="border-t border-green-50">
                                      <td className="px-3 py-2">{t.nombreApellido}</td>
                                      <td className="px-3 py-2">{t.cedulaIdentidad}</td>
                                      <td className="px-3 py-2">{t.cargo}</td>
                                      <td className="px-3 py-2">{new Date(t.fechaIngreso).toLocaleDateString('es-VE')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Vista Trabajadores */}
        {vista === 'trabajadores' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-800">Todos los Trabajadores ({trabajadores.length})</h2>
              <button onClick={cargarDatos} className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200">🔄 Actualizar</button>
            </div>
            {trabajadores.length === 0 ? (
              <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100"><p className="text-gray-500">No hay trabajadores registrados</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                  <thead className="bg-green-600 text-white">
                    <tr><th className="px-4 py-3 text-left text-sm">Nombre</th><th className="px-4 py-3 text-left text-sm">Cédula</th><th className="px-4 py-3 text-left text-sm">Cargo</th><th className="px-4 py-3 text-left text-sm">Fecha</th><th className="px-4 py-3 text-left text-sm">Centro</th></tr>
                  </thead>
                  <tbody>
                    {trabajadores.map(t => {
                      const centro = centros.find(c => c.id === t.centroTrabajoId);
                      return (
                        <tr key={t.id} className="border-t border-green-50 hover:bg-green-50">
                          <td className="px-4 py-3 text-sm font-medium">{t.nombreApellido}</td>
                          <td className="px-4 py-3 text-sm">{t.cedulaIdentidad}</td>
                          <td className="px-4 py-3 text-sm">{t.cargo}</td>
                          <td className="px-4 py-3 text-sm">{new Date(t.fechaIngreso).toLocaleDateString('es-VE')}</td>
                          <td className="px-4 py-3 text-sm">{centro?.razonSocial || 'N/A'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Reset Clave */}
      {showResetModal && usuarioReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🔑 Resetear Contraseña</h3>
            <p className="text-gray-600 text-sm mb-4">Usuario: <strong>{usuarioReset.correo}</strong></p>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nueva Contraseña</label><input type="text" value={nuevaClave} onChange={e => setNuevaClave(e.target.value)} placeholder="Mínimo 5 caracteres" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowResetModal(false); setUsuarioReset(null); setNuevaClave(''); }} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200">Cancelar</button>
              <button onClick={handleResetClave} className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">Guardar Clave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
