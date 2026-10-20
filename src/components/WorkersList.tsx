import { useState, useEffect } from 'react';
import { getWorkersByUserId, saveWorker, deleteWorker } from '../utils/storage';
import { Worker } from '../types';

interface WorkersListProps {
  userId: string;
}

export default function WorkersList({ userId }: WorkersListProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [nombreApellido, setNombreApellido] = useState('');
  const [cedulaIdentidad, setCedulaIdentidad] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadWorkers();
  }, [userId]);

  const loadWorkers = () => {
    setWorkers(getWorkersByUserId(userId));
  };

  const resetForm = () => {
    setNombreApellido('');
    setCedulaIdentidad('');
    setCargo('');
    setFechaIngreso('');
    setEditingWorker(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreApellido || !cedulaIdentidad || !cargo || !fechaIngreso) {
      setNotification('Por favor complete todos los campos.');
      setNotificationType('error');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const worker: Worker = {
      id: editingWorker ? editingWorker.id : `worker-${Date.now()}`,
      userId,
      nombreApellido,
      cedulaIdentidad,
      cargo,
      fechaIngreso,
    };

    saveWorker(worker);
    loadWorkers();
    resetForm();
    setNotification(editingWorker ? 'Trabajador actualizado exitosamente.' : 'Trabajador agregado exitosamente.');
    setNotificationType('success');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setNombreApellido(worker.nombreApellido);
    setCedulaIdentidad(worker.cedulaIdentidad);
    setCargo(worker.cargo);
    setFechaIngreso(worker.fechaIngreso);
    setShowForm(true);
  };

  const handleDelete = (workerId: string) => {
    if (confirm('¿Está seguro de eliminar este trabajador?')) {
      deleteWorker(workerId);
      loadWorkers();
      setNotification('Trabajador eliminado.');
      setNotificationType('success');
      setTimeout(() => setNotification(''), 3000);
    }
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Listado de Trabajadores</h3>
          <p className="text-sm text-gray-500">{workers.length} trabajador(es) registrado(s)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Trabajador
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-green-200 rounded-2xl p-6 mb-6 animate-fade-in">
          <h4 className="text-lg font-bold text-green-800 mb-4">
            {editingWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre y Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreApellido}
                  onChange={(e) => setNombreApellido(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Cédula de Identidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cedulaIdentidad}
                  onChange={(e) => setCedulaIdentidad(e.target.value)}
                  placeholder="V-12345678"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej: Cajero, Supervisor..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Fecha de Ingreso <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                {editingWorker ? 'Actualizar' : 'Guardar'} Trabajador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workers Table */}
      <div className="bg-white border-2 border-green-100 rounded-2xl overflow-hidden">
        {workers.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400 text-lg font-medium">No hay trabajadores registrados</p>
            <p className="text-gray-400 text-sm mt-1">Haga clic en "Agregar Trabajador" para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Nombre y Apellido</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Cédula de Identidad</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Fecha de Ingreso</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {workers.map((worker, index) => (
                  <tr key={worker.id} className="hover:bg-green-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{worker.nombreApellido}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{worker.cedulaIdentidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{worker.cargo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{worker.fechaIngreso}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(worker)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(worker.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
