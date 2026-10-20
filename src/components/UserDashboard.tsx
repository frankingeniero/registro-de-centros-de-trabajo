import { useState, useMemo, useEffect } from 'react';
import { estadosDeVenezuela } from '../data/venezuela';
import { Usuario, CentroTrabajo, Trabajador, PersonaACargo } from '../types';
import {
  getCentroPorUsuario, guardarCentroTrabajo, actualizarCentroTrabajo,
  getTrabajadoresPorCentro, agregarTrabajador, eliminarTrabajador,
  actualizarTrabajador, cerrarSesion,
} from '../utils/storage';
import { exportarCentroTrabajoPDF, exportarCentroTrabajoExcel } from '../utils/exportUtils';

interface Props { usuario: Usuario; onLogout: () => void; }

export default function UserDashboard({ usuario, onLogout }: Props) {
  const [vista, setVista] = useState<'centro' | 'trabajadores'>('centro');
  const [centro, setCentro] = useState<CentroTrabajo | null>(null);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' as 'exito' | 'error' | '' });
  const [cargando, setCargando] = useState(true);

  const [razonSocial, setRazonSocial] = useState('');
  const [rif, setRif] = useState('');
  const [tipoCentro, setTipoCentro] = useState<CentroTrabajo['tipoCentro'] | ''>('');
  const [estadoSel, setEstadoSel] = useState('');
  const [municipioSel, setMunicipioSel] = useState('');
  const [parroquiaSel, setParroquiaSel] = useState('');
  const [sector, setSector] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [centroComercial, setCentroComercial] = useState('');
  const [esSucursal, setEsSucursal] = useState('');
  const [ubicacionSucursal, setUbicacionSucursal] = useState('');
  const [personaACargo, setPersonaACargo] = useState<PersonaACargo>({ nombre: '', apellido: '', cedula: '', cargo: 'Gerente', telefono: '', correo: '' });
  const [eleccionDelegados, setEleccionDelegados] = useState('');
  const [existeComite, setExisteComite] = useState('');
  const [comiteActivo, setComiteActivo] = useState('');

  const [showTrabForm, setShowTrabForm] = useState(false);
  const [editTrabId, setEditTrabId] = useState<string | null>(null);
  const [trabNombre, setTrabNombre] = useState('');
  const [trabCedula, setTrabCedula] = useState('');
  const [trabCargo, setTrabCargo] = useState('');
  const [trabFecha, setTrabFecha] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [usuario.id]);

  const cargarDatos = async () => {
    setCargando(true);
    const centroExistente = await getCentroPorUsuario(usuario.id);
    if (centroExistente) {
      setCentro(centroExistente);
      setRazonSocial(centroExistente.razonSocial);
      setRif(centroExistente.rif);
      setTipoCentro(centroExistente.tipoCentro);
      setEstadoSel(centroExistente.estado);
      setMunicipioSel(centroExistente.municipio);
      setParroquiaSel(centroExistente.parroquia);
      setSector(centroExistente.sector);
      setCalle(centroExistente.calle);
      setNumeroLocal(centroExistente.numeroLocal);
      setCentroComercial(centroExistente.centroComercial);
      setEsSucursal(centroExistente.esSucursal);
      setUbicacionSucursal(centroExistente.ubicacionSucursal);
      setPersonaACargo(centroExistente.personaACargo);
      setEleccionDelegados(centroExistente.eleccionDelegados);
      setExisteComite(centroExistente.existeComite);
      setComiteActivo(centroExistente.comiteActivo);
      const trabs = await getTrabajadoresPorCentro(centroExistente.id);
      setTrabajadores(trabs);
    }
    setCargando(false);
  };

  const municipios = useMemo(() => {
    if (!estadoSel) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSel);
    return estado ? estado.municipios : [];
  }, [estadoSel]);

  const parroquias = useMemo(() => {
    if (!municipioSel) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSel);
    if (!estado) return [];
    const municipio = estado.municipios.find(m => m.municipio === municipioSel);
    return municipio ? municipio.parroquias : [];
  }, [estadoSel, municipioSel]);

  const handleGuardarCentro = async (e: React.FormEvent) => {
    e.preventDefault();
    const datos = {
      usuarioId: usuario.id, razonSocial, rif,
      tipoCentro: tipoCentro as CentroTrabajo['tipoCentro'],
      estado: estadoSel, municipio: municipioSel, parroquia: parroquiaSel,
      sector, calle, numeroLocal, centroComercial, esSucursal, ubicacionSucursal,
      personaACargo, eleccionDelegados, existeComite, comiteActivo,
    };
    if (centro) {
      const actualizado = { ...datos, id: centro.id, fechaRegistro: centro.fechaRegistro };
      await actualizarCentroTrabajo(actualizado);
      setCentro(actualizado);
    } else {
      const nuevo = await guardarCentroTrabajo(datos);
      setCentro(nuevo);
    }
    setMensaje({ texto: 'Datos guardados exitosamente', tipo: 'exito' });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  const handleGuardarTrabajador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!centro) return;
    if (editTrabId) {
      await actualizarTrabajador({ id: editTrabId, centroTrabajoId: centro.id, nombreApellido: trabNombre, cedulaIdentidad: trabCedula, cargo: trabCargo, fechaIngreso: trabFecha });
    } else {
      await agregarTrabajador({ centroTrabajoId: centro.id, nombreApellido: trabNombre, cedulaIdentidad: trabCedula, cargo: trabCargo, fechaIngreso: trabFecha });
    }
    const trabs = await getTrabajadoresPorCentro(centro.id);
    setTrabajadores(trabs);
    resetTrabForm();
  };

  const handleEditarTrabajador = (t: Trabajador) => {
    setEditTrabId(t.id); setTrabNombre(t.nombreApellido); setTrabCedula(t.cedulaIdentidad); setTrabCargo(t.cargo); setTrabFecha(t.fechaIngreso); setShowTrabForm(true);
  };

  const handleEliminarTrabajador = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este trabajador?')) {
      await eliminarTrabajador(id);
      if (centro) { const trabs = await getTrabajadoresPorCentro(centro.id); setTrabajadores(trabs); }
    }
  };

  const resetTrabForm = () => { setShowTrabForm(false); setEditTrabId(null); setTrabNombre(''); setTrabCedula(''); setTrabCargo(''); setTrabFecha(''); };

  const handleLogout = () => { cerrarSesion(); onLogout(); };

  if (cargando) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div><p className="mt-4 text-green-700">Cargando datos...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
            <div><h1 className="text-lg font-bold">{usuario.razonSocial}</h1><p className="text-green-100 text-xs">{usuario.correo}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {centro && (<>
              <button onClick={() => exportarCentroTrabajoPDF(centro, trabajadores)} className="hidden md:flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all">📄 PDF</button>
              <button onClick={() => exportarCentroTrabajoExcel(centro, trabajadores)} className="hidden md:flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm rounded-lg transition-all">📊 Excel</button>
            </>)}
            <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          <button onClick={() => setVista('centro')} className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition-all ${vista === 'centro' ? 'bg-white text-green-700 border-b-2 border-green-600' : 'text-green-600 hover:bg-green-100'}`}>📋 Datos del Centro</button>
          <button onClick={() => setVista('trabajadores')} className={`px-5 py-3 font-semibold text-sm rounded-t-lg transition-all ${vista === 'trabajadores' ? 'bg-white text-green-700 border-b-2 border-green-600' : 'text-green-600 hover:bg-green-100'}`}>👥 Trabajadores ({trabajadores.length})</button>
        </div>
      </div>

      {mensaje.texto && (<div className="max-w-6xl mx-auto px-4 mt-4"><div className={`p-4 rounded-xl text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{mensaje.texto}</div></div>)}

      <main className="max-w-6xl mx-auto px-4 py-6">
        {vista === 'centro' && (
          <form onSubmit={handleGuardarCentro} className="space-y-6">
            <section className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h2 className="text-lg font-bold text-green-800 mb-4">🏢 Tipo de Centro de Trabajo</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['Bodegón', 'Restaurante', 'Tienda', 'Almacén'] as const).map(tipo => (
                  <button key={tipo} type="button" onClick={() => setTipoCentro(tipo)} className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${tipoCentro === tipo ? 'border-green-500 bg-green-100 text-green-800 shadow-md' : 'border-green-200 bg-white text-gray-600 hover:border-green-300'}`}>
                    <span className="text-2xl block mb-1">{tipo === 'Bodegón' ? '🏪' : tipo === 'Restaurante' ? '🍽️' : tipo === 'Tienda' ? '🛍️' : '📦'}</span>{tipo}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-lg font-bold text-green-800 mb-4">📄 Datos Básicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nombre o Razón Social *</label><input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">RIF *</label><input type="text" value={rif} onChange={e => setRif(e.target.value)} placeholder="J-12345678-9" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required /></div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-lg font-bold text-green-800 mb-4">📍 Ubicación Geográfica</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Estado *</label><select value={estadoSel} onChange={e => { setEstadoSel(e.target.value); setMunicipioSel(''); setParroquiaSel(''); }} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required><option value="">Seleccione</option>{estadosDeVenezuela.map(e => <option key={e.estado} value={e.estado}>{e.estado}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Municipio *</label><select value={municipioSel} onChange={e => { setMunicipioSel(e.target.value); setParroquiaSel(''); }} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" disabled={!estadoSel} required><option value="">Seleccione</option>{municipios.map(m => <option key={m.municipio} value={m.municipio}>{m.municipio}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Parroquia *</label><select value={parroquiaSel} onChange={e => setParroquiaSel(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" disabled={!municipioSel} required><option value="">Seleccione</option>{parroquias.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Sector</label><input type="text" value={sector} onChange={e => setSector(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Calle / Avenida</label><input type="text" value={calle} onChange={e => setCalle(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">N° Local / Galpón</label><input type="text" value={numeroLocal} onChange={e => setNumeroLocal(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">¿Centro comercial?</label><select value={centroComercial} onChange={e => setCentroComercial(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white"><option value="">Seleccione</option><option value="Si">Sí</option><option value="No">No</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">¿Es sucursal?</label><select value={esSucursal} onChange={e => { setEsSucursal(e.target.value); if (e.target.value === 'No') setUbicacionSucursal(''); }} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white"><option value="">Seleccione</option><option value="Si">Sí</option><option value="No">No</option></select></div>
              </div>
              {esSucursal === 'Si' && (<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"><label className="block text-sm font-semibold text-amber-800 mb-2">📍 Ubicación sede principal</label><textarea value={ubicacionSucursal} onChange={e => setUbicacionSucursal(e.target.value)} className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 outline-none resize-none" rows={2} /></div>)}
            </section>

            <section className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-lg font-bold text-green-800 mb-4">👤 Persona a Cargo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label><input type="text" value={personaACargo.nombre} onChange={e => setPersonaACargo({...personaACargo, nombre: e.target.value})} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Apellido *</label><input type="text" value={personaACargo.apellido} onChange={e => setPersonaACargo({...personaACargo, apellido: e.target.value})} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Cédula *</label><input type="text" value={personaACargo.cedula} onChange={e => setPersonaACargo({...personaACargo, cedula: e.target.value})} placeholder="V-12345678" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label><select value={personaACargo.cargo} onChange={e => setPersonaACargo({...personaACargo, cargo: e.target.value as PersonaACargo['cargo']})} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required><option value="Gerente">Gerente</option><option value="Sub-Gerente">Sub-Gerente</option><option value="Encargado">Encargado</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label><input type="tel" value={personaACargo.telefono} onChange={e => setPersonaACargo({...personaACargo, telefono: e.target.value})} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Correo</label><input type="email" value={personaACargo.correo} onChange={e => setPersonaACargo({...personaACargo, correo: e.target.value})} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none" /></div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <h2 className="text-lg font-bold text-green-800 mb-4">✅ Afirmaciones o Negaciones</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">1. ¿En el último trimestre se ha realizado elección de delegados?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delegados" value="Si" checked={eleccionDelegados === 'Si'} onChange={e => setEleccionDelegados(e.target.value)} className="w-4 h-4 text-green-600" /><span>Sí</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delegados" value="No" checked={eleccionDelegados === 'No'} onChange={e => setEleccionDelegados(e.target.value)} className="w-4 h-4 text-green-600" /><span>No</span></label>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">2. ¿Existe la figura del comité?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="comite" value="Si" checked={existeComite === 'Si'} onChange={e => { setExisteComite(e.target.value); if (e.target.value === 'No') setComiteActivo(''); }} className="w-4 h-4 text-green-600" /><span>Sí</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="comite" value="No" checked={existeComite === 'No'} onChange={e => { setExisteComite(e.target.value); setComiteActivo(''); }} className="w-4 h-4 text-green-600" /><span>No</span></label>
                  </div>
                </div>
                {existeComite === 'Si' && (
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-sm font-semibold text-indigo-700 mb-3">¿Está activo el comité?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="activo" value="Si" checked={comiteActivo === 'Si'} onChange={e => setComiteActivo(e.target.value)} className="w-4 h-4 text-indigo-600" /><span>Sí</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="activo" value="No" checked={comiteActivo === 'No'} onChange={e => setComiteActivo(e.target.value)} className="w-4 h-4 text-indigo-600" /><span>No</span></label>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-wrap gap-3 justify-center pb-6">
              <button type="submit" className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md transition-all flex items-center gap-2">✓ Guardar Datos</button>
              {centro && (<><button type="button" onClick={() => exportarCentroTrabajoPDF(centro, trabajadores)} className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-md transition-all">📄 PDF</button><button type="button" onClick={() => exportarCentroTrabajoExcel(centro, trabajadores)} className="px-6 py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-md transition-all">📊 Excel</button></>)}
            </div>
          </form>
        )}

        {vista === 'trabajadores' && (
          <div className="space-y-6">
            {!centro ? (
              <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-gray-500 text-lg">⚠️ Primero registre los datos del centro</p>
                <button onClick={() => setVista('centro')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">Ir a Datos del Centro</button>
              </div>
            ) : (<>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-800">Listado de Trabajadores</h2>
                <button onClick={() => { resetTrabForm(); setShowTrabForm(true); }} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 flex items-center gap-2">+ Agregar</button>
              </div>
              {showTrabForm && (
                <form onSubmit={handleGuardarTrabajador} className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="font-bold text-green-800 mb-4">{editTrabId ? '✏️ Editar' : '➕ Nuevo'} Trabajador</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nombre y Apellido *</label><input type="text" value={trabNombre} onChange={e => setTrabNombre(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Cédula *</label><input type="text" value={trabCedula} onChange={e => setTrabCedula(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label><input type="text" value={trabCargo} onChange={e => setTrabCargo(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Ingreso *</label><input type="date" value={trabFecha} onChange={e => setTrabFecha(e.target.value)} className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none bg-white" required /></div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700">{editTrabId ? 'Actualizar' : 'Guardar'}</button>
                    <button type="button" onClick={resetTrabForm} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300">Cancelar</button>
                  </div>
                </form>
              )}
              {trabajadores.length === 0 ? (
                <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100"><p className="text-gray-500">No hay trabajadores registrados</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                    <thead className="bg-green-600 text-white">
                      <tr><th className="px-4 py-3 text-left text-sm">N°</th><th className="px-4 py-3 text-left text-sm">Nombre</th><th className="px-4 py-3 text-left text-sm">Cédula</th><th className="px-4 py-3 text-left text-sm">Cargo</th><th className="px-4 py-3 text-left text-sm">Fecha</th><th className="px-4 py-3 text-center text-sm">Acciones</th></tr>
                    </thead>
                    <tbody>
                      {trabajadores.map((t, i) => (
                        <tr key={t.id} className="border-t border-green-50 hover:bg-green-50">
                          <td className="px-4 py-3 text-sm">{i + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{t.nombreApellido}</td>
                          <td className="px-4 py-3 text-sm">{t.cedulaIdentidad}</td>
                          <td className="px-4 py-3 text-sm">{t.cargo}</td>
                          <td className="px-4 py-3 text-sm">{new Date(t.fechaIngreso).toLocaleDateString('es-VE')}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEditarTrabajador(t)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">✏️</button>
                              <button onClick={() => handleEliminarTrabajador(t.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>)}
          </div>
        )}
      </main>
    </div>
  );
}
