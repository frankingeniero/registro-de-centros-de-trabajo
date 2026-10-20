# 📋 Sistema de Registro de Centros de Trabajo - Venezuela

## 🌐 Sincronización en la Nube (Firebase)

Para que **todos los dispositivos puedan ver los mismos registros en tiempo real**, es necesario configurar Firebase Firestore.

### ✅ ¿Cómo funciona?

- **Sin Firebase**: Los datos se guardan solo en el navegador local (localStorage). Cada dispositivo tiene sus propios datos.
- **Con Firebase**: Los datos se sincronizan en la nube. Cualquier dispositivo con las mismas credenciales ve los mismos datos en tiempo real.

---

## 🔧 Pasos para Configurar Firebase

### 1. Crear cuenta en Firebase
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Agregar proyecto"**
4. Dale un nombre al proyecto (ej: "registro-centros-trabajo")
5. Acepta los términos y haz clic en **"Continuar"**
6. Desactiva Google Analytics (opcional) y haz clic en **"Crear proyecto"**

### 2. Crear base de datos Firestore
1. En el menú lateral, haz clic en **"Firestore Database"** → **"Crear base de datos"**
2. Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
3. Selecciona la ubicación más cercana (ej: `southamerica-east1` para Venezuela)
4. Haz clic en **"Habilitar"**

### 3. Registrar la aplicación web
1. En la página principal del proyecto, haz clic en el icono **Web (</>)**
2. Dale un nombre a la app (ej: "registro-web")
3. **NO** marques "Configurar también Firebase Hosting"
4. Haz clic en **"Registrar app"**
5. **Copia los valores de configuración** que aparecen. Se ven así:

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

### 4. Configurar la aplicación
1. Abre la aplicación web
2. En la pantalla de login, busca el botón flotante **"⚙️ Configurar Nube"** (esquina inferior derecha)
3. Pega las credenciales copiadas en los campos correspondientes
4. Haz clic en **"🔗 Conectar"**
5. ¡Listo! La base de datos en la nube está activa

---

## 🔄 Sincronización en Tiempo Real

Una vez configurado Firebase:

- ✅ **Todos los dispositivos** que usen las mismas credenciales ven los mismos datos
- ✅ Los cambios se reflejan **automáticamente** sin necesidad de recargar
- ✅ El administrador puede ver **todos los registros** de todos los centros de trabajo
- ✅ Los datos persisten aunque se cierre el navegador

### Indicador de estado:
- 🟢 **Verde**: Sincronización en la nube activa
- 🟡 **Amarillo**: Modo local (solo este dispositivo)

---

## 👤 Credenciales de Administrador

- **Correo**: `administrador@sistema.com`
- **Contraseña**: `frank12`

### Funciones del Administrador:
- ✅ Aprobar / Suspender usuarios
- ✅ Resetear contraseñas de usuarios
- ✅ Ver TODOS los centros de trabajo registrados
- ✅ Ver TODOS los trabajadores de todos los centros
- ✅ Exportar reportes generales en PDF y Excel
- ✅ Configurar la sincronización en la nube

---

## 📱 Uso desde diferentes dispositivos

1. **En cada dispositivo**, abre la aplicación web
2. **Configura Firebase** con las mismas credenciales en cada uno
3. Los usuarios, centros y trabajadores se sincronizarán automáticamente
4. El administrador puede ver todo desde cualquier dispositivo

---

## 🛡️ Seguridad (Recomendaciones)

Para producción, se recomienda:

1. **Configurar reglas de Firestore** para proteger los datos:
   - Ir a Firestore Database → Rules
   - Configurar reglas de autenticación

2. **Usar Firebase Authentication** en lugar de contraseñas en texto plano

3. **Restringir dominios** autorizados en Firebase Console

---

## 📊 Estructura de la Base de Datos

```
Firestore Database
├── usuarios/
│   ├── admin-001 (Administrador)
│   ├── usr-xxx (Usuarios registrados)
├── centros/
│   ├── ct-xxx (Centros de trabajo)
├── trabajadores/
│   ├── trab-xxx (Trabajadores de cada centro)
```

---

## 🆘 Solución de Problemas

### "Los datos no se sincronizan"
- Verifica que Firebase esté configurado correctamente (indicador verde)
- Asegúrate de usar las mismas credenciales en todos los dispositivos
- Verifica la conexión a internet

### "No puedo conectarme a Firebase"
- Revisa que las credenciales sean correctas
- Verifica que Firestore Database esté habilitado
- Comprueba que el proyecto esté activo

### "Perdí mis datos locales"
- Si Firebase estaba configurado, los datos están en la nube
- Si no, los datos locales se perdieron al cambiar de dispositivo

---

## 📞 Soporte

Para más información sobre Firebase:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Consola de Firebase](https://console.firebase.google.com/)

---

**Desarrollado para el registro de centros de trabajo en Venezuela** 🇻🇪
