import { useState, useMemo, useEffect } from 'react';
import { estadosDeVenezuela } from '../data/venezuela';
import { saveWorkCenter, getWorkCenterByUserId, getUserById } from '../utils/storage';
import { WorkCenterData, PersonInCharge } from '../types';

interface WorkCenterFormProps {
  userId: string;
  onSaved: () => void;
}

export default function WorkCenterForm({ userId, onSaved }: WorkCenterFormProps) {
  const [razonSocial, setRazonSocial] = useState('');
  const [rif, setRif] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState('');
  const [sector, setSector] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [tipoCentro, setTipoCentro] = useState<'' | 'Bodegón' | 'Restaurante' | 'Tienda' | 'Almacén'>('');
  const [centroComercial, setCentroComercial] = useState('');
  const [esSucursal, setEsSucursal] = useState('');
  const [ubicacionSucursal, setUbicacionSucursal] = useState('');
  const [eleccionDelegados, setEleccionDelegados] = useState('');
  const [existeComite, setExisteComite] = useState('');
  const [comiteActivo, setComiteActivo] = useState('');

  // Persona a cargo
  const [personInCharge, setPersonInCharge] = useState<PersonInCharge>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    cargo: 'Gerente',
  });

  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const user = getUserById(userId);
    if (user) {
      setRazonSocial(user.razonSocial);
    }
    const existing = getWorkCenterByUserId(userId);
    if (existing) {
      setRazonSocial(existing.razonSocial);
      setRif(existing.rif);
      setEstadoSeleccionado(existing.estado);
      setMunicipioSeleccionado(existing.municipio);
      setParroquiaSeleccionada(existing.parroquia);
      setSector(existing.sector);
      setCalle(existing.calle);
      setNumeroLocal(existing.numeroLocal);
      setTipoCentro(existing.tipoCentro as typeof tipoCentro);
      setCentroComercial(existing.centroComercial);
      setEsSucursal(existing.esSucursal);
      setUbicacionSucursal(existing.ubicacionSucursal);
      setEleccionDelegados(existing.eleccionDelegados);
      setExisteComite(existing.existeComite);
      setComiteActivo(existing.comiteActivo);
      setPersonInCharge(existing.personInCharge);
    }
  }, [userId]);

  const municipios = useMemo(() => {
    if (!estadoSeleccionado) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSeleccionado);
    return estado ? estado.municipios : [];
  }, [estadoSeleccionado]);

  const parroquias = useMemo(() => {
    if (!municipioSeleccionado) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSeleccionado);
    if (!estado) return [];
    const municipio = estado.municipios.find(m => m.municipio === municipioSeleccionado);
    return municipio ? municipio.parroquias : [];
  }, [estadoSeleccionado, municipioSeleccionado]);

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoSeleccionado(e.target.value);
    setMunicipioSeleccionado('');
    setParroquiaSeleccionada('');
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMunicipioSeleccionado(e.target.value);
    setParroquiaSeleccionada('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!razonSocial || !rif || !estadoSeleccionado || !municipioSeleccionado || !parroquiaSeleccionada || !tipoCentro) {
      setNotification('Por favor complete todos los campos obligatorios.');
      setNotificationType('error');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const data: WorkCenterData = {
      id: `wc-${userId}`,
      userId,
      razonSocial,
      rif,
      estado: estadoSeleccionado,
      municipio: municipioSeleccionado,
      parroquia: parroquiaSeleccionada,
      sector,
      calle,
      numeroLocal,
      tipoCentro,
      centroComercial,
      esSucursal,
      ubicacionSucursal,
      eleccionDelegados,
      existeComite,
      comiteActivo,
      personInCharge,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveWorkCenter(data);
    setNotification('Datos guardados exitosamente.');
    setNotificationType('success');
    setTimeout(() => setNotification(''), 3000);
    onSaved();
  };

  return (
    <div>
      {notification && (
        <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${
          notificationType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Centro */}
        <section className="bg-white border-2 border-green-100 rounded-2xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Datos del Centro de Trabajo
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {/* Razón Social y RIF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre o Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  RIF <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rif}
                  onChange={(e) => setRif(e.target.value)}
                  placeholder="J-12345678-9"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Tipo de Centro */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tipo de Centro de Trabajo <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['Bodegón', 'Restaurante', 'Tienda', 'Almacén'] as const).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoCentro(tipo)}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      tipoCentro === tipo
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {tipo === 'Bodegón' && '🏪 '}
                    {tipo === 'Restaurante' && '🍽️ '}
                    {tipo === 'Tienda' && '🛍️ '}
                    {tipo === 'Almacén' && '📦 '}
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* Ubicación */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Ubicación Geográfica</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado <span className="text-red-500">*</span></label>
                  <select
                    value={estadoSeleccionado}
                    onChange={handleEstadoChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Seleccione</option>
                    {estadosDeVenezuela.map((estado) => (
                      <option key={estado.estado} value={estado.estado}>{estado.estado}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Municipio <span className="text-red-500">*</span></label>
                  <select
                    value={municipioSeleccionado}
                    onChange={handleMunicipioChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                    disabled={!estadoSeleccionado}
                    required
                  >
                    <option value="">Seleccione</option>
                    {municipios.map((m) => (
                      <option key={m.municipio} value={m.municipio}>{m.municipio}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parroquia <span className="text-red-500">*</span></label>
                  <select
                    value={parroquiaSeleccionada}
                    onChange={(e) => setParroquiaSeleccionada(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                    disabled={!municipioSeleccionado}
                    required
                  >
                    <option value="">Seleccione</option>
                    {parroquias.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Dirección Detallada</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sector</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ej: Sector Industrial"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Calle / Avenida</label>
                  <input
                    type="text"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    placeholder="Ej: Av. Principal"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">N° Local / Galpón</label>
                  <input
                    type="text"
                    value={numeroLocal}
                    onChange={(e) => setNumeroLocal(e.target.value)}
                    placeholder="Ej: Local N° 15"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Opcionales */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Información Adicional (Opcional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">¿Se encuentra en un centro comercial?</label>
                  <select
                    value={centroComercial}
                    onChange={(e) => setCentroComercial(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                  >
                    <option value="">Seleccione</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">¿Es una sucursal?</label>
                  <select
                    value={esSucursal}
                    onChange={(e) => {
                      setEsSucursal(e.target.value);
                      if (e.target.value !== 'Si') setUbicacionSucursal('');
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                  >
                    <option value="">Seleccione</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              {esSucursal === 'Si' && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <label className="block text-sm font-semibold text-amber-800 mb-2">📍 Ubicación de la sede principal</label>
                  <textarea
                    value={ubicacionSucursal}
                    onChange={(e) => setUbicacionSucursal(e.target.value)}
                    placeholder="Dirección completa de la casa matriz..."
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none resize-none"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Persona a Cargo */}
        <section className="bg-white border-2 border-green-100 rounded-2xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Persona a Cargo del Centro de Trabajo
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={personInCharge.nombre}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={personInCharge.apellido}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, apellido: e.target.value })}
                  placeholder="Apellido"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cédula de Identidad <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={personInCharge.cedula}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, cedula: e.target.value })}
                  placeholder="V-12345678"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cargo <span className="text-red-500">*</span></label>
                <select
                  value={personInCharge.cargo}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, cargo: e.target.value as PersonInCharge['cargo'] })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none bg-white"
                  required
                >
                  <option value="Gerente">Gerente</option>
                  <option value="Subgerente">Subgerente</option>
                  <option value="Encargado">Encargado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={personInCharge.telefono}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, telefono: e.target.value })}
                  placeholder="0414-1234567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  value={personInCharge.email}
                  onChange={(e) => setPersonInCharge({ ...personInCharge, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Afirmaciones */}
        <section className="bg-white border-2 border-green-100 rounded-2xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Afirmaciones o Negaciones
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿En el último trimestre se ha realizado un proceso de elección de delegados?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="delegados" value="Si" checked={eleccionDelegados === 'Si'} onChange={(e) => setEleccionDelegados(e.target.value)} className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 font-medium">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="delegados" value="No" checked={eleccionDelegados === 'No'} onChange={(e) => setEleccionDelegados(e.target.value)} className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 font-medium">No</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Existe la figura del comité dentro del centro de trabajo?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="comite" value="Si" checked={existeComite === 'Si'} onChange={(e) => { setExisteComite(e.target.value); if (e.target.value !== 'Si') setComiteActivo(''); }} className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 font-medium">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="comite" value="No" checked={existeComite === 'No'} onChange={(e) => { setExisteComite(e.target.value); setComiteActivo(''); }} className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 font-medium">No</span>
                </label>
              </div>
            </div>

            {existeComite === 'Si' && (
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 animate-fade-in">
                <label className="block text-sm font-semibold text-green-700 mb-3">
                  ¿Está activo el comité?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="comiteActivo" value="Si" checked={comiteActivo === 'Si'} onChange={(e) => setComiteActivo(e.target.value)} className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="comiteActivo" value="No" checked={comiteActivo === 'No'} onChange={(e) => setComiteActivo(e.target.value)} className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                {comiteActivo === 'Si' && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">✓ El comité se encuentra activo en este centro de trabajo.</p>
                  </div>
                )}
                {comiteActivo === 'No' && (
                  <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-700 font-medium">⚠ El comité existe pero no está activo. Se continúa con la siguiente categoría.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-10 py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Guardar Datos del Centro
          </button>
        </div>
      </form>
    </div>
  );
}
