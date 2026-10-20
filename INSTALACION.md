# 📋 Guía de Instalación Detallada

## Paso 1: Descargar el Proyecto

### Opción A: Clonar desde GitHub
```bash
git clone https://github.com/TU-USUARIO/registro-centros-trabajo.git
cd registro-centros-trabajo
```

### Opción B: Descargar ZIP
1. Ve al repositorio en GitHub
2. Clic en "Code" → "Download ZIP"
3. Extrae el archivo ZIP
4. Abre la terminal en la carpeta extraída

## Paso 2: Instalar Node.js

Si no tienes Node.js instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Instala siguiendo las instrucciones
4. Verifica la instalación:
```bash
node --version
npm --version
```

## Paso 3: Instalar Dependencias

En la carpeta del proyecto, ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias. Puede tardar unos minutos.

## Paso 4: Configurar Firebase

### 4.1 Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Inicia sesión con tu cuenta de Google
3. Clic en "Agregar proyecto"
4. Nombre del proyecto: `registro-centros-trabajo` (o el que prefieras)
5. Acepta los términos y clic en "Continuar"
6. Desactiva Google Analytics (opcional)
7. Clic en "Crear proyecto"
8. Espera a que se cree el proyecto

### 4.2 Activar Firestore Database

1. En el menú lateral, clic en "Firestore Database"
2. Clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba"
4. Selecciona la ubicación más cercana (ej: `southamerica-east1`)
5. Clic en "Habilitar"

### 4.3 Configurar Reglas de Firestore

1. En Firestore Database, ve a la pestaña "Rules"
2. Reemplaza las reglas con:

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

3. Clic en "Publicar"

⚠️ **IMPORTANTE:** Estas reglas son solo para desarrollo. Para producción, configura autenticación.

### 4.4 Registrar Aplicación Web

1. En la página principal del proyecto, busca "Comenzar ahora"
2. Clic en el icono Web (</>)
3. Nombre de la app: `registro-web`
4. **NO** marques "Configurar también Firebase Hosting"
5. Clic en "Registrar app"
6. **COPIA** las credenciales que aparecen. Se ven así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Paso 5: Ejecutar la Aplicación

```bash
npm run dev
```

Se abrirá automáticamente en: http://localhost:5173

## Paso 6: Configurar Firebase en la Aplicación

1. En la pantalla de login, busca el botón flotante **"⚙️ Configurar Nube"** (esquina inferior derecha)
2. Pega las credenciales copiadas en los campos correspondientes:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
3. Clic en **"🔗 Conectar"**
4. Espera el mensaje de éxito

✅ ¡Listo! La aplicación está conectada a Firebase.

## Paso 7: Probar la Aplicación

### Login como Administrador
- **Correo:** `administrador@sistema.com`
- **Contraseña:** `frank12`

### Registrar un Usuario de Prueba
1. En la pantalla de login, clic en "Registrarse"
2. Completa el formulario
3. Inicia sesión como administrador
4. Aprueba el usuario

### Probar Funcionalidades
1. Registra un centro de trabajo
2. Agrega trabajadores
3. Exporta a PDF/Excel
4. Cierra sesión y verifica que los datos persistan

## Paso 8: Construir para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## Paso 9: Desplegar (Opcional)

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

### Vercel
1. Sube el código a GitHub
2. Ve a https://vercel.com
3. Importa el repositorio
4. Despliega automáticamente

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Firebase not configured"
- Verifica que las credenciales estén correctas
- Verifica que Firestore esté habilitado
- Verifica las reglas de Firestore

### Error: "Permission denied" en Firestore
- Verifica las reglas de Firestore
- Para desarrollo, usa las reglas permisivas indicadas arriba

### La página se ve en blanco
- Abre la consola del navegador (F12)
- Verifica los errores
- Asegúrate de que `npm run build` funcione sin errores

## 📞 Soporte

- Documentación de Firebase: https://firebase.google.com/docs
- Documentación de React: https://react.dev
- Documentación de Vite: https://vitejs.dev

---

**¡Éxito con tu instalación!** 🚀
