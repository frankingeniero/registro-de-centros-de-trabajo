import { useState } from 'react';
import { FirebaseConfig, initializeFirebase, saveFirebaseConfig, loadFirebaseConfig, clearFirebaseConfig, isFirebaseReady } from '../utils/firebase';

interface Props {
  onBack: () => void;
  onConfigured: () => void;
}

export default function ConfigPanel({ onBack, onConfigured }: Props) {
  const configExistente = loadFirebaseConfig();
  const [apiKey, setApiKey] = useState(configExistente?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(configExistente?.authDomain || '');
  const [projectId, setProjectId] = useState(configExistente?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(configExistente?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(configExistente?.messagingSenderId || '');
  const [appId, setAppId] = useState(configExistente?.appId || '');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' as 'exito' | 'error' | '' });
  const [conectando, setConectando] = useState(false);

  const handleConectar = () => {
    if (!apiKey || !projectId || !appId) {
      setMensaje({ texto: 'Complete al menos: API Key, Project ID y App ID', tipo: 'error' });
      return;
    }
    
    setConectando(true);
    const config: FirebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };
    
    const exito = initializeFirebase(config);
    if (exito) {
      saveFirebaseConfig(config);
      setMensaje({ texto: '¡Conexión exitosa! La base de datos en la nube está activa.', tipo: 'exito' });
      setTimeout(() => onConfigured(), 1500);
    } else {
      setMensaje({ texto: 'Error al conectar. Verifique las credenciales.', tipo: 'error' });
      setConectando(false);
    }
  };

  const handleDesconectar = () => {
    if (confirm('¿Está seguro de desconectar la base de datos en la nube? Los datos se manejarán localmente.')) {
      clearFirebaseConfig();
      onConfigured();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-700">Configuración de Sincronización en la Nube</h1>
          <p className="text-gray-500 mt-1">Conecte Firebase Firestore para sincronizar datos entre equipos</p>
        </div>

        {/* Estado actual */}
        <div className={`p-4 rounded-xl mb-6 border ${isFirebaseReady() ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isFirebaseReady() ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <div>
              <p className={`font-semibold ${isFirebaseReady() ? 'text-green-700' : 'text-yellow-700'}`}>
                {isFirebaseReady() ? '🟢 Base de datos en la nube ACTIVA' : '🟡 Modo local (solo este dispositivo)'}
              </p>
              <p className="text-sm text-gray-600">
                {isFirebaseReady() 
                  ? 'Todos los dispositivos conectados verán los mismos datos en tiempo real' 
                  : 'Los datos solo se guardan en este navegador. Configure Firebase para sincronizar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje.texto && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensaje.texto}
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-blue-800 mb-2">📋 ¿Cómo obtener las credenciales de Firebase?</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.firebase.google.com</a></li>
            <li>Crea un proyecto nuevo (o usa uno existente)</li>
            <li>Ve a "Project Settings" → "General" → "Your apps"</li>
            <li>Haz clic en "Add app" → Web app (icono &lt;/&gt;)</li>
            <li>Copia los valores de <code className="bg-blue-100 px-1 rounded">firebaseConfig</code></li>
            <li>Ve a "Firestore Database" → "Create database" → Modo de prueba</li>
            <li>Pega las credenciales aquí abajo</li>
          </ol>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">API Key *</label>
            <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Auth Domain</label>
            <input type="text" value={authDomain} onChange={e => setAuthDomain(e.target.value)} placeholder="tu-proyecto.firebaseapp.com" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Project ID *</label>
            <input type="text" value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="tu-proyecto-id" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Storage Bucket</label>
            <input type="text" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} placeholder="tu-proyecto.appspot.com" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Messaging Sender ID</label>
            <input type="text" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} placeholder="123456789" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">App ID *</label>
            <input type="text" value={appId} onChange={e => setAppId(e.target.value)} placeholder="1:123456789:web:abc123" className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none font-mono text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onBack} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">
              ← Volver
            </button>
            {isFirebaseReady() && (
              <button onClick={handleDesconectar} className="px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all">
                Desconectar
              </button>
            )}
            <button onClick={handleConectar} disabled={conectando} className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50">
              {conectando ? 'Conectando...' : '🔗 Conectar'}
            </button>
          </div>
        </div>

        {/* Nota importante */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Importante:</strong> Al activar la nube, TODOS los dispositivos que usen las mismas credenciales de Firebase compartirán la misma base de datos. Los cambios se reflejan en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
