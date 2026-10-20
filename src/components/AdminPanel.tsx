import { useState, useEffect } from 'react';
import { getAllUsers, approveUser, suspendUser, resetUserPassword, getAllWorkCenters, getAllWorkers } from '../utils/storage';
import { exportAllToPDF, exportAllToExcel } from '../utils/exportUtils';
import { User, WorkCenterData, Worker } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenterData[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'centers' | 'workers'>('users');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getAllUsers());
    setWorkCenters(getAllWorkCenters());
    setWorkers(getAllWorkers());
  };

  const handleApprove = (userId: string) => {
    approveUser(userId);
    loadData();
    setNotification('Usuario aprobado exitosamente.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSuspend = (userId: string) => {
    if (confirm('¿Está seguro de suspender este usuario?')) {
      suspendUser(userId);
      loadData();
      setNotification('Usuario suspendido.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleOpenPasswordModal = (userId: string) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    resetUserPassword(selectedUserId, newPassword);
    setShowPasswordModal(false);
    setNotification('Contraseña actualizada exitosamente.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleExportPDF = () => {
    exportAllToPDF(users, workCenters, workers);
    setNotification('PDF generado exitosamente.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleExportExcel = () => {
    exportAllToExcel(users, workCenters, workers);
    setNotification('Excel generado exitosamente.');
    setTimeout(() => setNotification(''), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Aprobado</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pendiente</span>;
      case 'suspended':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Suspendido</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Panel de Administrador</h1>
              <p className="text-green-200 text-xs">Gestión de Centros de Trabajo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Usuarios</p>
                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Centros Registrados</p>
                <p className="text-2xl font-bold text-gray-800">{workCenters.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Trabajadores</p>
                <p className="text-2xl font-bold text-gray-800">{workers.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-green-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'users' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('centers')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'centers' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            Centros ({workCenters.length})
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'workers' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            Trabajadores ({workers.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border-2 border-green-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Correo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Razón Social</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Fecha Registro</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No hay usuarios registrados aún.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-green-50/50">
                        <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{user.razonSocial}</td>
                        <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('es-VE')}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {user.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(user.id)}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Aprobar
                              </button>
                            )}
                            {user.status === 'approved' && (
                              <button
                                onClick={() => handleSuspend(user.id)}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Suspender
                              </button>
                            )}
                            {user.status === 'suspended' && (
                              <button
                                onClick={() => handleApprove(user.id)}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Reactivar
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenPasswordModal(user.id)}
                              className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Clave
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Centers Tab */}
          {activeTab === 'centers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Razón Social</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">RIF</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Municipio</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Encargado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workCenters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No hay centros de trabajo registrados aún.
                      </td>
                    </tr>
                  ) : (
                    workCenters.map((wc) => (
                      <tr key={wc.id} className="hover:bg-green-50/50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">{wc.razonSocial}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{wc.rif}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{wc.tipoCentro}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{wc.estado}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{wc.municipio}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{wc.personInCharge.nombre} {wc.personInCharge.apellido}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Workers Tab */}
          {activeTab === 'workers' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Nombre y Apellido</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Cédula</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Cargo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Fecha Ingreso</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Centro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No hay trabajadores registrados aún.
                      </td>
                    </tr>
                  ) : (
                    workers.map((w) => {
                      const wc = workCenters.find(c => c.userId === w.userId);
                      return (
                        <tr key={w.id} className="hover:bg-green-50/50">
                          <td className="px-4 py-3 text-sm text-gray-700 font-medium">{w.nombreApellido}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{w.cedulaIdentidad}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{w.cargo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{w.fechaIngreso}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{wc?.razonSocial || 'N/A'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Asignar/Recuperar Contraseña</h3>
            <p className="text-sm text-gray-500 mb-4">Ingrese la nueva contraseña para este usuario:</p>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
