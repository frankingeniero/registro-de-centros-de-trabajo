import { useState, useEffect } from 'react';
import { getUserById, getWorkCenterByUserId, getWorkersByUserId } from '../utils/storage';
import { exportWorkCenterToPDF, exportWorkCenterToExcel } from '../utils/exportUtils';
import { User } from '../types';
import WorkCenterForm from './WorkCenterForm';
import WorkersList from './WorkersList';

interface UserDashboardProps {
  userId: string;
  onLogout: () => void;
}

export default function UserDashboard({ userId, onLogout }: UserDashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'center' | 'workers'>('center');
  const [hasWorkCenter, setHasWorkCenter] = useState(false);
  const [workersCount, setWorkersCount] = useState(0);

  useEffect(() => {
    const u = getUserById(userId);
    if (u) setUser(u);
    checkData();
  }, [userId]);

  const checkData = () => {
    const wc = getWorkCenterByUserId(userId);
    setHasWorkCenter(!!wc);
    const workers = getWorkersByUserId(userId);
    setWorkersCount(workers.length);
  };

  const handleExportPDF = () => {
    const wc = getWorkCenterByUserId(userId);
    const workers = getWorkersByUserId(userId);
    if (wc) {
      exportWorkCenterToPDF(wc, workers);
    } else {
      alert('Primero debe guardar los datos del centro de trabajo.');
    }
  };

  const handleExportExcel = () => {
    const wc = getWorkCenterByUserId(userId);
    const workers = getWorkersByUserId(userId);
    if (wc) {
      exportWorkCenterToExcel(wc, workers);
    } else {
      alert('Primero debe guardar los datos del centro de trabajo.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.razonSocial}</h1>
              <p className="text-green-200 text-xs">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              title="Descargar PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              title="Descargar Excel"
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Centro Registrado</p>
                <p className="text-lg font-bold text-gray-800">{hasWorkCenter ? 'Sí ✓' : 'Pendiente'}</p>
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
                <p className="text-lg font-bold text-gray-800">{workersCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Estado de Cuenta</p>
                <p className="text-lg font-bold text-green-600">Activo</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-green-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('center')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'center' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            📋 Datos del Centro
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'workers' ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-100'
            }`}
          >
            👥 Trabajadores ({workersCount})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'center' && (
          <WorkCenterForm userId={userId} onSaved={checkData} />
        )}
        {activeTab === 'workers' && (
          <WorkersList userId={userId} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">Sistema de Gestión de Centros de Trabajo - Venezuela</p>
        </div>
      </footer>
    </div>
  );
}
