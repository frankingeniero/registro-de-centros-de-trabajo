import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getDB, isFirebaseReady } from './firebase';
import { Usuario, CentroTrabajo, Trabajador, Sesion } from '../types';

// ===== LOCAL STORAGE (Fallback) =====
const KEYS = {
  USUARIOS: 've_usuarios',
  CENTROS: 've_centros_trabajo',
  TRABAJADORES: 've_trabajadores',
  SESION: 've_sesion',
};

// ===== VERIFICAR MODO =====
export function isCloudMode(): boolean {
  return isFirebaseReady();
}

// ===== INICIALIZAR ADMIN =====
export async function inicializarAdmin(): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const q = query(collection(db, 'usuarios'), where('rol', '==', 'administrador'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      const admin: Usuario = {
        id: 'admin-001',
        correo: 'administrador@sistema.com',
        razonSocial: 'Administrador del Sistema',
        clave: 'frank12',
        estado: 'aprobado',
        fechaRegistro: new Date().toISOString(),
        rol: 'administrador',
      };
      await setDoc(doc(db, 'usuarios', admin.id), admin);
    }
  } else {
    const usuarios = getUsuariosLocal();
    const adminExiste = usuarios.find(u => u.rol === 'administrador');
    if (!adminExiste) {
      const admin: Usuario = {
        id: 'admin-001',
        correo: 'administrador@sistema.com',
        razonSocial: 'Administrador del Sistema',
        clave: 'frank12',
        estado: 'aprobado',
        fechaRegistro: new Date().toISOString(),
        rol: 'administrador',
      };
      usuarios.push(admin);
      localStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
    }
  }
}

// ===== USUARIOS =====
function getUsuariosLocal(): Usuario[] {
  const data = localStorage.getItem(KEYS.USUARIOS);
  return data ? JSON.parse(data) : [];
}

export async function getUsuarios(): Promise<Usuario[]> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const snapshot = await getDocs(collection(db, 'usuarios'));
    return snapshot.docs.map(d => d.data() as Usuario);
  }
  return getUsuariosLocal();
}

function guardarUsuariosLocal(usuarios: Usuario[]) {
  localStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
}

export async function registrarUsuario(usuario: Omit<Usuario, 'id' | 'estado' | 'fechaRegistro' | 'rol'>): Promise<{ exito: boolean; mensaje: string }> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const q = query(collection(db, 'usuarios'), where('correo', '==', usuario.correo));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { exito: false, mensaje: 'El correo ya está registrado' };
    }
    const nuevo: Usuario = {
      ...usuario,
      id: 'usr-' + Date.now(),
      estado: 'pendiente',
      fechaRegistro: new Date().toISOString(),
      rol: 'usuario',
    };
    await setDoc(doc(db, 'usuarios', nuevo.id), nuevo);
    return { exito: true, mensaje: 'Registro exitoso. Espere aprobación del administrador.' };
  }
  
  const usuarios = getUsuariosLocal();
  if (usuarios.find(u => u.correo === usuario.correo)) {
    return { exito: false, mensaje: 'El correo ya está registrado' };
  }
  const nuevo: Usuario = {
    ...usuario,
    id: 'usr-' + Date.now(),
    estado: 'pendiente',
    fechaRegistro: new Date().toISOString(),
    rol: 'usuario',
  };
  usuarios.push(nuevo);
  guardarUsuariosLocal(usuarios);
  return { exito: true, mensaje: 'Registro exitoso. Espere aprobación del administrador.' };
}

export async function login(correo: string, clave: string): Promise<{ exito: boolean; mensaje: string; usuario?: Usuario }> {
  let user: Usuario | undefined;
  
  if (isFirebaseReady()) {
    const db = getDB()!;
    const q = query(collection(db, 'usuarios'), where('correo', '==', correo), where('clave', '==', clave));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      user = snapshot.docs[0].data() as Usuario;
    }
  } else {
    const usuarios = getUsuariosLocal();
    user = usuarios.find(u => u.correo === correo && u.clave === clave);
  }
  
  if (!user) {
    return { exito: false, mensaje: 'Credenciales incorrectas' };
  }
  if (user.estado === 'pendiente') {
    return { exito: false, mensaje: 'Su cuenta está pendiente de aprobación por el administrador' };
  }
  if (user.estado === 'suspendido') {
    return { exito: false, mensaje: 'Su cuenta está suspendida. Contacte al administrador' };
  }
  const sesion: Sesion = { usuarioId: user.id, rol: user.rol };
  localStorage.setItem(KEYS.SESION, JSON.stringify(sesion));
  return { exito: true, mensaje: 'Bienvenido', usuario: user };
}

export function getSesion(): Sesion | null {
  const data = localStorage.getItem(KEYS.SESION);
  return data ? JSON.parse(data) : null;
}

export function cerrarSesion() {
  localStorage.removeItem(KEYS.SESION);
}

export async function getUsuarioPorId(id: string): Promise<Usuario | undefined> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const docSnap = await getDoc(doc(db, 'usuarios', id));
    return docSnap.exists() ? docSnap.data() as Usuario : undefined;
  }
  return getUsuariosLocal().find(u => u.id === id);
}

export async function actualizarEstadoUsuario(id: string, estado: Usuario['estado']): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    await updateDoc(doc(db, 'usuarios', id), { estado });
  } else {
    const usuarios = getUsuariosLocal();
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      usuarios[idx].estado = estado;
      guardarUsuariosLocal(usuarios);
    }
  }
}

export async function resetearClave(id: string, nuevaClave: string): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    await updateDoc(doc(db, 'usuarios', id), { clave: nuevaClave });
  } else {
    const usuarios = getUsuariosLocal();
    const idx = usuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      usuarios[idx].clave = nuevaClave;
      guardarUsuariosLocal(usuarios);
    }
  }
}

// ===== CENTROS DE TRABAJO =====
function getCentrosLocal(): CentroTrabajo[] {
  const data = localStorage.getItem(KEYS.CENTROS);
  return data ? JSON.parse(data) : [];
}

export async function getCentrosTrabajo(): Promise<CentroTrabajo[]> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const snapshot = await getDocs(collection(db, 'centros'));
    return snapshot.docs.map(d => d.data() as CentroTrabajo);
  }
  return getCentrosLocal();
}

export async function guardarCentroTrabajo(centro: Omit<CentroTrabajo, 'id' | 'fechaRegistro'>): Promise<CentroTrabajo> {
  const nuevo: CentroTrabajo = {
    ...centro,
    id: 'ct-' + Date.now(),
    fechaRegistro: new Date().toISOString(),
  };
  
  if (isFirebaseReady()) {
    const db = getDB()!;
    await setDoc(doc(db, 'centros', nuevo.id), nuevo);
  } else {
    const centros = getCentrosLocal();
    centros.push(nuevo);
    localStorage.setItem(KEYS.CENTROS, JSON.stringify(centros));
  }
  return nuevo;
}

export async function actualizarCentroTrabajo(centro: CentroTrabajo): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    await setDoc(doc(db, 'centros', centro.id), centro);
  } else {
    const centros = getCentrosLocal();
    const idx = centros.findIndex(c => c.id === centro.id);
    if (idx !== -1) {
      centros[idx] = centro;
      localStorage.setItem(KEYS.CENTROS, JSON.stringify(centros));
    }
  }
}

export async function getCentroPorUsuario(usuarioId: string): Promise<CentroTrabajo | undefined> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const q = query(collection(db, 'centros'), where('usuarioId', '==', usuarioId));
    const snapshot = await getDocs(q);
    return !snapshot.empty ? snapshot.docs[0].data() as CentroTrabajo : undefined;
  }
  return getCentrosLocal().find(c => c.usuarioId === usuarioId);
}

// ===== TRABAJADORES =====
function getTrabajadoresLocal(): Trabajador[] {
  const data = localStorage.getItem(KEYS.TRABAJADORES);
  return data ? JSON.parse(data) : [];
}

export async function getTrabajadores(): Promise<Trabajador[]> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const snapshot = await getDocs(collection(db, 'trabajadores'));
    return snapshot.docs.map(d => d.data() as Trabajador);
  }
  return getTrabajadoresLocal();
}

export async function getTrabajadoresPorCentro(centroId: string): Promise<Trabajador[]> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    const q = query(collection(db, 'trabajadores'), where('centroTrabajoId', '==', centroId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Trabajador);
  }
  return getTrabajadoresLocal().filter(t => t.centroTrabajoId === centroId);
}

export async function agregarTrabajador(trabajador: Omit<Trabajador, 'id'>): Promise<Trabajador> {
  const nuevo: Trabajador = {
    ...trabajador,
    id: 'trab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
  };
  
  if (isFirebaseReady()) {
    const db = getDB()!;
    await setDoc(doc(db, 'trabajadores', nuevo.id), nuevo);
  } else {
    const trabajadores = getTrabajadoresLocal();
    trabajadores.push(nuevo);
    localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
  }
  return nuevo;
}

export async function eliminarTrabajador(id: string): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    await deleteDoc(doc(db, 'trabajadores', id));
  } else {
    const trabajadores = getTrabajadoresLocal().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
  }
}

export async function actualizarTrabajador(trabajador: Trabajador): Promise<void> {
  if (isFirebaseReady()) {
    const db = getDB()!;
    await setDoc(doc(db, 'trabajadores', trabajador.id), trabajador);
  } else {
    const trabajadores = getTrabajadoresLocal();
    const idx = trabajadores.findIndex(t => t.id === trabajador.id);
    if (idx !== -1) {
      trabajadores[idx] = trabajador;
      localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
    }
  }
}

// ===== REAL-TIME LISTENERS =====
export function subscribeToUsuarios(callback: (usuarios: Usuario[]) => void): Unsubscribe | null {
  if (!isFirebaseReady()) return null;
  const db = getDB()!;
  return onSnapshot(collection(db, 'usuarios'), (snapshot) => {
    const usuarios = snapshot.docs.map(d => d.data() as Usuario);
    callback(usuarios);
  });
}

export function subscribeToCentros(callback: (centros: CentroTrabajo[]) => void): Unsubscribe | null {
  if (!isFirebaseReady()) return null;
  const db = getDB()!;
  return onSnapshot(collection(db, 'centros'), (snapshot) => {
    const centros = snapshot.docs.map(d => d.data() as CentroTrabajo);
    callback(centros);
  });
}

export function subscribeToTrabajadores(callback: (trabajadores: Trabajador[]) => void): Unsubscribe | null {
  if (!isFirebaseReady()) return null;
  const db = getDB()!;
  return onSnapshot(collection(db, 'trabajadores'), (snapshot) => {
    const trabajadores = snapshot.docs.map(d => d.data() as Trabajador);
    callback(trabajadores);
  });
}
