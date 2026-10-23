# 🏢 Sistema de Registro de Centros de Trabajo - Venezuela

Sistema web completo para el registro y gestión de centros de trabajo en Venezuela, con sincronización en la nube mediante Firebase Firestore.

## 🌟 Características

### Para Usuarios:
- ✅ Registro de centros de trabajo con datos completos
- ✅ Listas desplegables en cascada: Estado → Municipio → Parroquia (Venezuela)
- ✅ Identificación del tipo de centro: Bodegón, Restaurante, Tienda, Almacén
- ✅ Datos de la persona a cargo (Gerente, Sub-Gerente, Encargado)
- ✅ Gestión de trabajadores (agregar, editar, eliminar)
- ✅ Afirmaciones/Negaciones sobre delegados y comités
- ✅ Exportación a PDF y Excel
- ✅ Sincronización en tiempo real

### Para Administradores:
- ✅ Gestión de usuarios (aprobar, suspender, reactivar)
- ✅ Resetear contraseñas de usuarios
- ✅ Ver todos los centros de trabajo registrados
- ✅ Ver todos los trabajadores de todos los centros
- ✅ Exportar reportes generales en PDF y Excel
- ✅ Sincronización en tiempo real desde cualquier dispositivo

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn
- Cuenta de Google (para Firebase)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/TU-USUARIO/registro-centros-trabajo.git
cd registro-centros-trabajo
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar Firebase:**

   a. Ve a [Firebase Console](https://console.firebase.google.com/)
   
   b. Crea un nuevo proyecto
   
   c. Activa Firestore Database (modo prueba para desarrollo)
   
   d. Registra una aplicación web
   
   e. Copia las credenciales de configuración

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

5. **Abrir en el navegador:**
```
http://localhost:5173
```

6. **Configurar Firebase en la aplicación:**
   - En la pantalla de login, busca el botón "⚙️ Configurar Nube"
   - Pega las credenciales de Firebase
   - Haz clic en "Conectar"

## 🔥 CONFIGURAR FIREBASE (IMPORTANTE)

Para que la sincronización en la nube funcione, necesitas configurar Firebase:

### Guía Rápida (7 minutos):

1. **Crear proyecto en Firebase:**
   - Ve a https://console.firebase.google.com/
   - Clic en "Agregar proyecto"
   - Nombre: `registro-centros-trabajo`

2. **Activar Firestore Database:**
   - Menú lateral → "Firestore Database"
   - Clic en "Crear base de datos"
   - Modo: "Comenzar en modo de prueba"

3. **Configurar reglas:**
   - Pestaña "Reglas"
   - Pega las reglas permisivas (ver `FIREBASE_CONFIG.md`)

4. **Registrar app web:**
   - Configuración del proyecto → "Tus aplicaciones"
   - Clic en ícono Web (</>)
   - Copia las credenciales

5. **Conectar en tu página:**
   - Abre tu página web
   - Clic en "⚙️ Configurar Nube" (botón flotante)
   - Pega las credenciales
   - Clic en "Conectar"

📚 **Guías detalladas:**
- `RESUMEN_FIREBASE.md` - Resumen en 3 pasos
- `CONFIGURAR_FIREBASE_PASO_A_PASO.md` - Guía completa
- `FIREBASE_RAPIDO.md` - Guía visual rápida
- `EJEMPLO_CREDENCIALES_FIREBASE.md` - Ejemplo de credenciales
- `VERIFICAR_FIREBASE.md` - Verificar que funciona

## 🔐 Credenciales de Administrador

- **Correo:** `administrador@sistema.com`
- **Contraseña:** `frank12`

## 📦 Construcción para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🌐 Despliegue

### Opción 1: Firebase Hosting (Recomendada)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar hosting
firebase init hosting

# Construir proyecto
npm run build

# Desplegar
firebase deploy --only hosting
```

### Opción 2: Vercel

1. Sube el código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa el repositorio
4. Despliega automáticamente

### Opción 3: Netlify

1. Construye el proyecto: `npm run build`
2. Ve a [Netlify Drop](https://app.netlify.com/drop)
3. Arrastra la carpeta `dist`

## 📁 Estructura del Proyecto

```
registro-centros-trabajo/
├── public/                 # Archivos públicos
├── src/
│   ├── components/        # Componentes React
│   │   ├── AdminPanel.tsx
│   │   ├── ConfigPanel.tsx
│   │   ├── LoginPage.tsx
│   │   └── UserDashboard.tsx
│   ├── data/
│   │   └── venezuela.ts   # Datos de estados, municipios, parroquias
│   ├── types.ts           # Tipos TypeScript
│   ├── utils/
│   │   ├── exportUtils.ts # Funciones de exportación PDF/Excel
│   │   ├── firebase.ts    # Configuración de Firebase
│   │   └── storage.ts     # Funciones de almacenamiento
│   ├── App.tsx            # Componente principal
│   ├── index.css          # Estilos globales
│   └── main.tsx           # Punto de entrada
├── .gitignore
├── firebase.json          # Configuración de Firebase Hosting
├── index.html
├── package.json
├── README.md
├── GUIA_PUBLICACION.md    # Guía completa de publicación
├── PUBLICACION_RAPIDA.md  # Guía rápida de publicación
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de CSS
- **Firebase Firestore** - Base de datos en la nube
- **jsPDF** - Generación de PDF
- **XLSX** - Generación de Excel

## 📊 Base de Datos

La aplicación utiliza Firebase Firestore con las siguientes colecciones:

- **usuarios** - Usuarios registrados (administradores y usuarios normales)
- **centros** - Centros de trabajo registrados
- **trabajadores** - Trabajadores de cada centro

## 🔒 Seguridad

### Para Desarrollo (Modo Prueba):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Para Producción:
Configura reglas de seguridad más estrictas y considera usar Firebase Authentication.

## 🌍 Datos de Venezuela

La aplicación incluye datos completos de:
- 24 Estados
- 335 Municipios
- 1,146 Parroquias

## 📱 Responsivo

La aplicación es completamente responsiva y funciona en:
- 💻 Escritorio
- 📱 Tablets
- 📱 Móviles

## 🆘 Soporte

Para problemas o preguntas:
- Revisa las guías de publicación: `GUIA_PUBLICACION.md` y `PUBLICACION_RAPIDA.md`
- Documentación de Firebase: https://firebase.google.com/docs

## 📝 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.

## 🎉 Créditos

Desarrollado para el registro de centros de trabajo en Venezuela 🇻🇪

---

**¡Gracias por usar este sistema!** 🚀
