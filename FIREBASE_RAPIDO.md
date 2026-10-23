# 🔥 CONFIGURACIÓN RÁPIDA DE FIREBASE (5 MINUTOS)

Guía visual rápida para configurar Firebase.

---

## 📸 PASO 1: CREAR PROYECTO

### Ve a Firebase Console
```
https://console.firebase.google.com/
```

### Haz clic en "Agregar proyecto"
```
[+ Agregar proyecto]
```

### Escribe el nombre del proyecto
```
Nombre: registro-centros-trabajo
```

### Continúa sin Google Analytics
```
❌ Desactiva Google Analytics
[Continuar]
```

### Crea el proyecto
```
[Crear proyecto]
```

---

## 📸 PASO 2: ACTIVAR FIRESTORE

### En el menú lateral, busca "Firestore Database"
```
Menú lateral → Compilación → Firestore Database
```

### Crea la base de datos
```
[Crear base de datos]
```

### Selecciona ubicación
```
Ubicación: southamerica-east1 (São Paulo)
[Siguiente]
```

### Elige modo de prueba
```
✅ Comenzar en modo de prueba
[Habilitar]
```

---

## 📸 PASO 3: CONFIGURAR REGLAS

### Ve a la pestaña "Reglas"
```
Firestore Database → Pestaña "Reglas"
```

### Borra todo y pega esto:
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

### Publica las reglas
```
[Publicar]
```

---

## 📸 PASO 4: REGISTRAR APP WEB

### Ve a Configuración del proyecto
```
⚙️ (engranaje) → Configuración del proyecto
```

### Baja hasta "Tus aplicaciones"
```
Baja en la página → Sección "Tus aplicaciones"
```

### Haz clic en el ícono Web (</>)
```
Ícono: </> (Web)
```

### Registra la app
```
Apodo: registro-web
❌ NO marques "Firebase Hosting"
[Registrar app]
```

### 📋 COPIA LAS CREDENCIALES
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                    ← COPIA ESTO
  authDomain: "tu-proyecto.firebaseapp.com",  ← COPIA ESTO
  projectId: "tu-proyecto-id",            ← COPIA ESTO
  storageBucket: "tu-proyecto.appspot.com",  ← COPIA ESTO
  messagingSenderId: "123456789",         ← COPIA ESTO
  appId: "1:123:web:abc123"               ← COPIA ESTO
};
```

---

## 📸 PASO 5: CONECTAR EN TU PÁGINA

### Abre tu página web
```
http://localhost:5173
O
https://tu-pagina.pages.dev
```

### Busca el botón flotante
```
Esquina inferior derecha: [⚙️ Configurar Nube]
```

### Haz clic y pega las credenciales
```
API Key: [pega aquí]
Auth Domain: [pega aquí]
Project ID: [pega aquí]
Storage Bucket: [pega aquí]
Messaging Sender ID: [pega aquí]
App ID: [pega aquí]
```

### Conecta
```
[🔗 Conectar]
```

---

## ✅ VERIFICAR QUE FUNCIONA

### En tu página:
```
El botón debe cambiar a: [🟢 Nube Activa]
```

### En Firebase Console:
```
Firestore Database → Deberías ver colecciones:
  - usuarios
  - centros
  - trabajadores
```

---

## 🎯 RESUMEN EN 7 CLICKS

1. Click en "Agregar proyecto" en Firebase Console
2. Click en "Crear base de datos" en Firestore
3. Click en "Publicar" en Reglas
4. Click en ícono Web (</>) en Configuración
5. Click en "Registrar app"
6. Click en "⚙️ Configurar Nube" en tu página
7. Click en "🔗 Conectar"

**¡Listo! Firebase está configurado.** ✅

---

## 🆘 PROBLEMAS RÁPIDOS

### "Error al conectar"
→ Verifica que copiaste bien las credenciales

### "Permission denied"
→ Verifica las reglas de Firestore (Paso 3)

### "No se sincroniza"
→ Verifica que el botón diga "🟢 Nube Activa"

---

**¡Configuración completada en 5 minutos!** 🚀
