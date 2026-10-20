export interface Usuario {
  id: string;
  correo: string;
  razonSocial: string;
  clave: string;
  estado: 'pendiente' | 'aprobado' | 'suspendido';
  fechaRegistro: string;
  rol: 'usuario' | 'administrador';
}

export interface PersonaACargo {
  nombre: string;
  apellido: string;
  cedula: string;
  cargo: 'Gerente' | 'Sub-Gerente' | 'Encargado';
  telefono: string;
  correo: string;
}

export interface CentroTrabajo {
  id: string;
  usuarioId: string;
  razonSocial: string;
  rif: string;
  tipoCentro: 'Bodegón' | 'Restaurante' | 'Tienda' | 'Almacén';
  estado: string;
  municipio: string;
  parroquia: string;
  sector: string;
  calle: string;
  numeroLocal: string;
  centroComercial: string;
  esSucursal: string;
  ubicacionSucursal: string;
  personaACargo: PersonaACargo;
  eleccionDelegados: string;
  existeComite: string;
  comiteActivo: string;
  fechaRegistro: string;
}

export interface Trabajador {
  id: string;
  centroTrabajoId: string;
  nombreApellido: string;
  cedulaIdentidad: string;
  cargo: string;
  fechaIngreso: string;
}

export interface Sesion {
  usuarioId: string;
  rol: 'usuario' | 'administrador';
}
