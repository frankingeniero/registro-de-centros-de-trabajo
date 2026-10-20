export interface User {
  id: string;
  email: string;
  razonSocial: string;
  password: string;
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface PersonInCharge {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  cargo: 'Gerente' | 'Subgerente' | 'Encargado';
}

export interface WorkCenterData {
  id: string;
  userId: string;
  razonSocial: string;
  rif: string;
  estado: string;
  municipio: string;
  parroquia: string;
  sector: string;
  calle: string;
  numeroLocal: string;
  tipoCentro: 'Bodegón' | 'Restaurante' | 'Tienda' | 'Almacén' | '';
  centroComercial: string;
  esSucursal: string;
  ubicacionSucursal: string;
  eleccionDelegados: string;
  existeComite: string;
  comiteActivo: string;
  personInCharge: PersonInCharge;
  createdAt: string;
  updatedAt: string;
}

export interface Worker {
  id: string;
  userId: string;
  nombreApellido: string;
  cedulaIdentidad: string;
  cargo: string;
  fechaIngreso: string;
}

export interface Database {
  users: User[];
  workCenters: WorkCenterData[];
  workers: Worker[];
}
