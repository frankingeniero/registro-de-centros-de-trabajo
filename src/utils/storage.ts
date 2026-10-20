import { Database, User, WorkCenterData, Worker } from '../types';

const DB_KEY = 'centro_trabajo_db';

const ADMIN_USER: User = {
  id: 'admin-001',
  email: 'administrador',
  razonSocial: 'Administrador del Sistema',
  password: 'frank12',
  status: 'approved',
  createdAt: new Date().toISOString(),
};

function getDatabase(): Database {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    return JSON.parse(data);
  }
  const initial: Database = {
    users: [],
    workCenters: [],
    workers: [],
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDatabase(db: Database): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Admin functions
export function loginAdmin(username: string, password: string): boolean {
  return username === 'administrador' && password === 'frank12';
}

// User functions
export function registerUser(email: string, razonSocial: string, password: string): { success: boolean; message: string } {
  const db = getDatabase();
  const exists = db.users.find(u => u.email === email);
  if (exists) {
    return { success: false, message: 'Este correo ya está registrado.' };
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    razonSocial,
    password,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDatabase(db);
  return { success: true, message: 'Registro exitoso. Espere la aprobación del administrador.' };
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; message: string } {
  const db = getDatabase();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Credenciales incorrectas.' };
  }
  if (user.status === 'pending') {
    return { success: false, message: 'Su cuenta está pendiente de aprobación.' };
  }
  if (user.status === 'suspended') {
    return { success: false, message: 'Su cuenta ha sido suspendida.' };
  }
  user.lastLogin = new Date().toISOString();
  saveDatabase(db);
  return { success: true, user, message: 'Inicio de sesión exitoso.' };
}

export function getAllUsers(): User[] {
  return getDatabase().users;
}

export function approveUser(userId: string): void {
  const db = getDatabase();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.status = 'approved';
    saveDatabase(db);
  }
}

export function suspendUser(userId: string): void {
  const db = getDatabase();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.status = 'suspended';
    saveDatabase(db);
  }
}

export function resetUserPassword(userId: string, newPassword: string): void {
  const db = getDatabase();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.password = newPassword;
    saveDatabase(db);
  }
}

export function getUserById(userId: string): User | undefined {
  return getDatabase().users.find(u => u.id === userId);
}

// Work Center functions
export function saveWorkCenter(data: WorkCenterData): void {
  const db = getDatabase();
  const index = db.workCenters.findIndex(wc => wc.userId === data.userId);
  if (index >= 0) {
    db.workCenters[index] = { ...data, updatedAt: new Date().toISOString() };
  } else {
    db.workCenters.push(data);
  }
  saveDatabase(db);
}

export function getWorkCenterByUserId(userId: string): WorkCenterData | undefined {
  return getDatabase().workCenters.find(wc => wc.userId === userId);
}

export function getAllWorkCenters(): WorkCenterData[] {
  return getDatabase().workCenters;
}

// Worker functions
export function saveWorker(worker: Worker): void {
  const db = getDatabase();
  const index = db.workers.findIndex(w => w.id === worker.id);
  if (index >= 0) {
    db.workers[index] = worker;
  } else {
    db.workers.push(worker);
  }
  saveDatabase(db);
}

export function getWorkersByUserId(userId: string): Worker[] {
  return getDatabase().workers.filter(w => w.userId === userId);
}

export function deleteWorker(workerId: string): void {
  const db = getDatabase();
  db.workers = db.workers.filter(w => w.id !== workerId);
  saveDatabase(db);
}

export function getAllWorkers(): Worker[] {
  return getDatabase().workers;
}

export function getFullDatabase(): Database {
  return getDatabase();
}
