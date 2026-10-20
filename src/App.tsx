import { useState, useMemo } from 'react';
import { estadosDeVenezuela } from './data/venezuela';

function App() {
  // Datos del centro de trabajo
  const [razonSocial, setRazonSocial] = useState('');
  const [rif, setRif] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState('');
  const [sector, setSector] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [centroComercial, setCentroComercial] = useState('');
  const [esSucursal, setEsSucursal] = useState('');
  const [ubicacionSucursal, setUbicacionSucursal] = useState('');

  // Afirmaciones o negaciones
  const [eleccionDelegados, setEleccionDelegados] = useState('');
  const [existeComite, setExisteComite] = useState('');
  const [comiteActivo, setComiteActivo] = useState('');

  // Estados para modales
  const [showSucursalModal, setShowSucursalModal] = useState(false);
  const [showComiteModal, setShowComiteModal] = useState(false);
  const [showComiteActivoModal, setShowComiteActivoModal] = useState(false);

  // Obtener municipios del estado seleccionado
  const municipios = useMemo(() => {
    if (!estadoSeleccionado) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSeleccionado);
    return estado ? estado.municipios : [];
  }, [estadoSeleccionado]);

  // Obtener parroquias del municipio seleccionado
  const parroquias = useMemo(() => {
    if (!municipioSeleccionado) return [];
    const estado = estadosDeVenezuela.find(e => e.estado === estadoSeleccionado);
    if (!estado) return [];
    const municipio = estado.municipios.find(m => m.municipio === municipioSeleccionado);
    return municipio ? municipio.parroquias : [];
  }, [estadoSeleccionado, municipioSeleccionado]);

  // Handlers
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoSeleccionado(e.target.value);
    setMunicipioSeleccionado('');
    setParroquiaSeleccionada('');
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMunicipioSeleccionado(e.target.value);
    setParroquiaSeleccionada('');
  };

  const handleSucursalChange = (value: string) => {
    setEsSucursal(value);
    if (value === 'Si') {
      setShowSucursalModal(true);
    } else {
      setShowSucursalModal(false);
      setUbicacionSucursal('');
    }
  };

  const handleExisteComiteChange = (value: string) => {
    setExisteComite(value);
    if (value === 'Si') {
      setShowComiteModal(true);
    } else {
      setShowComiteModal(false);
      setComiteActivo('');
      setShowComiteActivoModal(false);
    }
  };

  const handleComiteActivoChange = (value: string) => {
    setComiteActivo(value);
    if (value === 'Si') {
      setShowComiteActivoModal(true);
    } else {
      setShowComiteActivoModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulario enviado exitosamente. Revise los datos ingresados.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Registro de Centro de Trabajo</h1>
              <p className="text-blue-200 text-sm md:text-base">Formulario de datos del centro de trabajo - República Bolivariana de Venezuela</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Datos del Centro de Trabajo */}
          <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Datos del Centro de Trabajo
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Nombre/Razón Social y RIF */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre o Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    placeholder="Ingrese el nombre o razón social"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RIF de la Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rif}
                    onChange={(e) => setRif(e.target.value)}
                    placeholder="J-12345678-9"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Ubicación Geográfica */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ubicación Geográfica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado / Región <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={estadoSeleccionado}
                      onChange={handleEstadoChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Seleccione un estado</option>
                      {estadosDeVenezuela.map((estado) => (
                        <option key={estado.estado} value={estado.estado}>
                          {estado.estado}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Municipio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Municipio <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={municipioSeleccionado}
                      onChange={handleMunicipioChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                      disabled={!estadoSeleccionado}
                      required
                    >
                      <option value="">Seleccione un municipio</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.municipio} value={municipio.municipio}>
                          {municipio.municipio}
                        </option>
                      ))}
                    </select>
                    {!estadoSeleccionado && (
                      <p className="text-xs text-gray-400 mt-1">Primero seleccione un estado</p>
                    )}
                  </div>

                  {/* Parroquia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parroquia <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={parroquiaSeleccionada}
                      onChange={(e) => setParroquiaSeleccionada(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                      disabled={!municipioSeleccionado}
                      required
                    >
                      <option value="">Seleccione una parroquia</option>
                      {parroquias.map((parroquia) => (
                        <option key={parroquia} value={parroquia}>
                          {parroquia}
                        </option>
                      ))}
                    </select>
                    {!municipioSeleccionado && (
                      <p className="text-xs text-gray-400 mt-1">Primero seleccione un municipio</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dirección Detallada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sector / Urbanización
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="Ej: Sector Industrial"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calle / Avenida
                    </label>
                    <input
                      type="text"
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      placeholder="Ej: Av. Principal"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      N° de Local / Galpón
                    </label>
                    <input
                      type="text"
                      value={numeroLocal}
                      onChange={(e) => setNumeroLocal(e.target.value)}
                      placeholder="Ej: Local N° 15"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Opcionales: Centro Comercial y Sucursal */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información Adicional (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Centro Comercial */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿El centro de trabajo se encuentra en un centro comercial?
                    </label>
                    <select
                      value={centroComercial}
                      onChange={(e) => setCentroComercial(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Sucursal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿El centro de trabajo es una sucursal?
                    </label>
                    <select
                      value={esSucursal}
                      onChange={(e) => handleSucursalChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* Mostrar ubicación de sucursal si se seleccionó Sí */}
                {esSucursal === 'Si' && (
                  <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      📍 Indique dónde está ubicada la casa matriz / sede principal
                    </label>
                    <textarea
                      value={ubicacionSucursal}
                      onChange={(e) => setUbicacionSucursal(e.target.value)}
                      placeholder="Describa la ubicación de la sede principal (dirección completa, ciudad, estado...)"
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sección 2: Afirmaciones o Negaciones */}
          <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Afirmaciones o Negaciones
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Elección de delegados */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  1. ¿En el último trimestre se ha realizado un proceso de elección de delegados?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eleccionDelegados"
                      value="Si"
                      checked={eleccionDelegados === 'Si'}
                      onChange={(e) => setEleccionDelegados(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="eleccionDelegados"
                      value="No"
                      checked={eleccionDelegados === 'No'}
                      onChange={(e) => setEleccionDelegados(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              {/* Existencia de comité */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  2. ¿Existe la figura del comité dentro del centro de trabajo?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="existeComite"
                      value="Si"
                      checked={existeComite === 'Si'}
                      onChange={(e) => handleExisteComiteChange(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="existeComite"
                      value="No"
                      checked={existeComite === 'No'}
                      onChange={(e) => handleExisteComiteChange(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              {/* Panel de diálogo del comité - Se muestra si existe comité */}
              {existeComite === 'Si' && (
                <div className="p-5 bg-indigo-50 rounded-xl border-2 border-indigo-200 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-indigo-800">Panel del Comité</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-indigo-700 mb-3">
                        ¿Está activo el comité?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="comiteActivo"
                            value="Si"
                            checked={comiteActivo === 'Si'}
                            onChange={(e) => handleComiteActivoChange(e.target.value)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700 font-medium">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="comiteActivo"
                            value="No"
                            checked={comiteActivo === 'No'}
                            onChange={(e) => handleComiteActivoChange(e.target.value)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700 font-medium">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Si el comité está activo, mostrar información adicional */}
                    {comiteActivo === 'Si' && (
                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-green-700">Comité Activo</span>
                        </div>
                        <p className="text-sm text-green-600">El comité de trabajadores se encuentra activo en este centro de trabajo.</p>
                      </div>
                    )}

                    {/* Si el comité NO está activo */}
                    {comiteActivo === 'No' && (
                      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-red-700">Comité Inactivo</span>
                        </div>
                        <p className="text-sm text-red-600">El comité existe pero actualmente no se encuentra activo. Se continúa con la siguiente categoría.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Si no existe comité, mensaje de continuación */}
              {existeComite === 'No' && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-yellow-700 font-medium">No existe comité en el centro de trabajo. Se continúa con la siguiente categoría del formulario.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Botón de envío */}
          <div className="flex justify-center pb-8">
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar Registro
            </button>
          </div>
        </form>

        {/* Modal de Sucursal */}
        {showSucursalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Ubicación de la Sucursal
                </h3>
                <button
                  onClick={() => { setShowSucursalModal(false); setEsSucursal(''); setUbicacionSucursal(''); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">Por favor, indique dónde se encuentra ubicada la casa matriz o sede principal:</p>
              <textarea
                value={ubicacionSucursal}
                onChange={(e) => setUbicacionSucursal(e.target.value)}
                placeholder="Dirección completa de la sede principal..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowSucursalModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowSucursalModal(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal del Comité */}
        {showComiteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Comité del Centro de Trabajo
                </h3>
                <button
                  onClick={() => { setShowComiteModal(false); setExisteComite(''); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">Se ha confirmado que existe la figura del comité en el centro de trabajo. Complete la información adicional en el panel inferior.</p>
              <button
                onClick={() => setShowComiteModal(false)}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm">Registro de Centros de Trabajo - República Bolivariana de Venezuela</p>
          <p className="text-xs mt-1 text-gray-500">Sistema de gestión de datos laborales</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
