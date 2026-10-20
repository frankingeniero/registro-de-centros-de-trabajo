# 🔥 Configuración de Firebase - Ejemplo

Este archivo muestra cómo configurar Firebase en tu proyecto.

## Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Clic en "Agregar proyecto"
3. Nombre: `registro-centros-trabajo`
4. Sigue los pasos hasta crear el proyecto

## Paso 2: Activar Firestore Database

1. Menú lateral → "Firestore Database"
2. Clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Elige la ubicación más cercana
5. Clic en "Habilitar"

## Paso 3: Configurar Reglas

En Firestore Database → Rules, pega esto:

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

⚠️ **IMPORTANTE:** Estas reglas son solo para desarrollo. Para producción, configura autenticación.

## Paso 4: Registrar Aplicación Web

1. Página principal del proyecto → Icono Web (</>)
2. Nombre: `registro-web`
3. **NO** marques "Configurar también Firebase Hosting"
4. Clic en "Registrar app"
5. Copia las credenciales

## Paso 5: Credenciales de Ejemplo

Tus credenciales se verán así (reemplaza con las tuyas):

```javascript
{
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "registro-centros-trabajo.firebaseapp.com",
  projectId: "registro-centros-trabajo",
  storageBucket: "registro-centros-trabajo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
}
```

## Paso 6: Configurar en la Aplicación

1. Ejecuta `npm run dev`
2. Abre http://localhost:5173
3. Clic en "⚙️ Configurar Nube" (botón flotante)
4. Pega tus credenciales
5. Clic en "Conectar"

## Estructura de la Base de Datos

Firebase creará automáticamente estas colecciones:

```
Firestore Database
├── usuarios/
│   ├── admin-001 (Administrador por defecto)
│   │   ├── correo: administrador@sistema.com
│   │   ├── clave: frank12
│   │   ├── rol: administrador
│   │   └── estado: aprobado
│   └── usr-xxx (Usuarios registrados)
│       ├── correo
│       ├── razonSocial
│       ├── clave
│       ├── estado: pendiente/aprobado/suspendido
│       └── rol: usuario
│
├── centros/
│   └── ct-xxx (Centros de trabajo)
│       ├── usuarioId
│       ├── razonSocial
│       ├── rif
│       ├── tipoCentro: Bodegón/Restaurante/Tienda/Almacén
│       ├── estado
│       ├── municipio
│       ├── parroquia
│       ├── sector
│       ├── calle
│       ├── numeroLocal
│       ├── centroComercial: Si/No
│       ├── esSucursal: Si/No
│       ├── ubicacionSucursal
│       ├── personaACargo
│       │   ├── nombre
│       │   ├── apellido
│       │   ├── cedula
│       │   ├── cargo: Gerente/Sub-Gerente/Encargado
│       │   ├── telefono
│       │   └── correo
│       ├── eleccionDelegados: Si/No
│       ├── existeComite: Si/No
│       ├── comiteActivo: Si/No
│       └── fechaRegistro
│
└── trabajadores/
    └── trab-xxx (Trabajadores)
        ├── centroTrabajoId
        ├── nombreApellido
        ├── cedulaIdentidad
        ├── cargo
        └── fechaIngreso
```

## Reglas de Seguridad para Producción

Para producción, considera usar Firebase Authentication y reglas más estrictas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer
    match /{document=**} {
      allow read: if request.auth != null;
      
      // Solo administradores pueden escribir
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'administrador';
    }
  }
}
```

## Solución de Problemas

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Para desarrollo, usa `allow read, write: if true;`

### Error: "Firebase not configured"
- Verifica que las credenciales estén correctas
- Verifica que Firestore esté habilitado

### Los datos no se sincronizan
- Verifica que Firebase esté configurado (indicador verde)
- Verifica la conexión a internet
- Recarga la página

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Consola de Firebase](https://console.firebase.google.com/)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)

---

**¡Configuración completada!** 🎉
