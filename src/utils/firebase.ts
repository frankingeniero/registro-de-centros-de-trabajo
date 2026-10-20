import { initializeApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Inicializar Firebase con configuración dinámica
export function initializeFirebase(config: FirebaseConfig): boolean {
  try {
    // Si ya hay una app, eliminarla primero
    if (app) {
      deleteApp(app).catch(() => {});
    }
    
    app = initializeApp(config);
    firestore = getFirestore(app);
    return true;
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
    return false;
  }
}

// Obtener instancia de Firestore
export function getDB(): Firestore | null {
  return firestore;
}

// Verificar si Firebase está inicializado
export function isFirebaseReady(): boolean {
  return firestore !== null;
}

// Guardar configuración en localStorage
export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem('firebase_config', JSON.stringify(config));
}

// Cargar configuración desde localStorage
export function loadFirebaseConfig(): FirebaseConfig | null {
  const data = localStorage.getItem('firebase_config');
  return data ? JSON.parse(data) : null;
}

// Limpiar configuración
export function clearFirebaseConfig(): void {
  localStorage.removeItem('firebase_config');
  if (app) {
    deleteApp(app).catch(() => {});
    app = null;
    firestore = null;
  }
}
