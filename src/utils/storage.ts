import { Usuario, CentroTrabajo, Trabajador, Sesion } from '../types';

const KEYS = {
  USUARIOS: 've_usuarios',
  CENTROS: 've_centros_trabajo',
  TRABAJADORES: 've_trabajadores',
  SESION: 've_sesion',
};

// Inicializar admin si no existe
export function inicializarAdmin() {
  const usuarios = getUsuarios();
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

// USUARIOS
export function getUsuarios(): Usuario[] {
  const data = localStorage.getItem(KEYS.USUARIOS);
  return data ? JSON.parse(data) : [];
}

export function guardarUsuarios(usuarios: Usuario[]) {
  localStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
}

export function registrarUsuario(usuario: Omit<Usuario, 'id' | 'estado' | 'fechaRegistro' | 'rol'>): { exito: boolean; mensaje: string } {
  const usuarios = getUsuarios();
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
  guardarUsuarios(usuarios);
  return { exito: true, mensaje: 'Registro exitoso. Espere aprobación del administrador.' };
}

export function login(correo: string, clave: string): { exito: boolean; mensaje: string; usuario?: Usuario } {
  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.correo === correo && u.clave === clave);
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

export function getUsuarioPorId(id: string): Usuario | undefined {
  return getUsuarios().find(u => u.id === id);
}

export function actualizarEstadoUsuario(id: string, estado: Usuario['estado']) {
  const usuarios = getUsuarios();
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx !== -1) {
    usuarios[idx].estado = estado;
    guardarUsuarios(usuarios);
  }
}

export function resetearClave(id: string, nuevaClave: string) {
  const usuarios = getUsuarios();
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx !== -1) {
    usuarios[idx].clave = nuevaClave;
    guardarUsuarios(usuarios);
  }
}

// CENTROS DE TRABAJO
export function getCentrosTrabajo(): CentroTrabajo[] {
  const data = localStorage.getItem(KEYS.CENTROS);
  return data ? JSON.parse(data) : [];
}

export function guardarCentroTrabajo(centro: Omit<CentroTrabajo, 'id' | 'fechaRegistro'>): CentroTrabajo {
  const centros = getCentrosTrabajo();
  const nuevo: CentroTrabajo = {
    ...centro,
    id: 'ct-' + Date.now(),
    fechaRegistro: new Date().toISOString(),
  };
  centros.push(nuevo);
  localStorage.setItem(KEYS.CENTROS, JSON.stringify(centros));
  return nuevo;
}

export function actualizarCentroTrabajo(centro: CentroTrabajo) {
  const centros = getCentrosTrabajo();
  const idx = centros.findIndex(c => c.id === centro.id);
  if (idx !== -1) {
    centros[idx] = centro;
    localStorage.setItem(KEYS.CENTROS, JSON.stringify(centros));
  }
}

export function getCentroPorUsuario(usuarioId: string): CentroTrabajo | undefined {
  return getCentrosTrabajo().find(c => c.usuarioId === usuarioId);
}

// TRABAJADORES
export function getTrabajadores(): Trabajador[] {
  const data = localStorage.getItem(KEYS.TRABAJADORES);
  return data ? JSON.parse(data) : [];
}

export function getTrabajadoresPorCentro(centroId: string): Trabajador[] {
  return getTrabajadores().filter(t => t.centroTrabajoId === centroId);
}

export function agregarTrabajador(trabajador: Omit<Trabajador, 'id'>): Trabajador {
  const trabajadores = getTrabajadores();
  const nuevo: Trabajador = {
    ...trabajador,
    id: 'trab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
  };
  trabajadores.push(nuevo);
  localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
  return nuevo;
}

export function eliminarTrabajador(id: string) {
  const trabajadores = getTrabajadores().filter(t => t.id !== id);
  localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
}

export function actualizarTrabajador(trabajador: Trabajador) {
  const trabajadores = getTrabajadores();
  const idx = trabajadores.findIndex(t => t.id === trabajador.id);
  if (idx !== -1) {
    trabajadores[idx] = trabajador;
    localStorage.setItem(KEYS.TRABAJADORES, JSON.stringify(trabajadores));
  }
}
