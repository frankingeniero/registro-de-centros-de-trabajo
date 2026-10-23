# 📋 EJEMPLO DE CREDENCIALES DE FIREBASE

Este archivo te muestra exactamente qué debes copiar desde Firebase Console.

---

## 🔍 ¿DÓNDE ENCUENTRAS LAS CREDENCIALES?

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Haz clic en el ícono de engranaje ⚙️ (Configuración)
4. Baja hasta la sección "Tus aplicaciones"
5. Si no tienes una app web registrada, haz clic en el ícono **</>** (Web)
6. Registra la app con el nombre "registro-web"
7. Verás un cuadro con las credenciales

---

## 📋 EJEMPLO DE CREDENCIALES

Firebase te mostrará algo como esto:

```javascript
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "registro-centros-trabajo-abc12.firebaseapp.com",
  projectId: "registro-centros-trabajo-abc12",
  storageBucket: "registro-centros-trabajo-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef12",
  measurementId: "G-ABCDEF1234"
};
```

---

## ✅ QUÉ DEBES COPIAR

De ese código, necesitas copiar **SOLO** estos valores:

### 1. API Key
```
apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz"
         ↑ Copia solo el valor entre comillas
```

### 2. Auth Domain
```
authDomain: "registro-centros-trabajo-abc12.firebaseapp.com"
              ↑ Copia solo el valor entre comillas
```

### 3. Project ID
```
projectId: "registro-centros-trabajo-abc12"
            ↑ Copia solo el valor entre comillas
```

### 4. Storage Bucket
```
storageBucket: "registro-centros-trabajo-abc12.appspot.com"
                ↑ Copia solo el valor entre comillas
```

### 5. Messaging Sender ID
```
messagingSenderId: "123456789012"
                    ↑ Copia solo el valor entre comillas
```

### 6. App ID
```
appId: "1:123456789012:web:abcdef1234567890abcdef12"
        ↑ Copia solo el valor entre comillas
```

### ❌ NO necesitas copiar:
- `measurementId` (este es opcional)
- Las palabras `const firebaseConfig = {`
- Los corchetes `{` y `}`
- Los puntos y comas `;`

---

## 📝 CÓMO PEGAR EN TU PÁGINA

### Paso 1: Abrir el panel de configuración
En tu página web, haz clic en el botón flotante:
```
[⚙️ Configurar Nube]
```

### Paso 2: Pegar cada valor en su campo

| Campo en tu página | Valor de Firebase |
|-------------------|-------------------|
| **API Key** | `AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz` |
| **Auth Domain** | `registro-centros-trabajo-abc12.firebaseapp.com` |
| **Project ID** | `registro-centros-trabajo-abc12` |
| **Storage Bucket** | `registro-centros-trabajo-abc12.appspot.com` |
| **Messaging Sender ID** | `123456789012` |
| **App ID** | `1:123456789012:web:abcdef1234567890abcdef12` |

### Paso 3: Conectar
Haz clic en el botón:
```
[🔗 Conectar]
```

---

## ⚠️ ERRORES COMUNES AL COPIAR

### ❌ Error 1: Copiar espacios extra
```
apiKey: " AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz "
         ↑ Espacio al inicio     ↑ Espacio al final
```
**Solución:** Copia solo el texto entre comillas, sin espacios

### ❌ Error 2: Copiar las comillas
```
apiKey: ""AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz""
         ↑ Comilla extra     ↑ Comilla extra
```
**Solución:** No copies las comillas, solo el texto

### ❌ Error 3: Copiar el nombre de la variable
```
apiKey: "apiKey: AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz"
         ↑ No copies "apiKey:"
```
**Solución:** Copia solo el valor, no el nombre de la variable

### ❌ Error 4: Dejar campos vacíos
```
API Key: AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
Auth Domain: (vacío)  ← ERROR
Project ID: registro-centros-trabajo-abc12
```
**Solución:** Todos los campos obligatorios deben estar llenos

---

## ✅ VERIFICAR QUE COPIASTE BIEN

Antes de hacer clic en "Conectar", verifica:

- [ ] API Key no está vacío
- [ ] Auth Domain no está vacío
- [ ] Project ID no está vacío
- [ ] Storage Bucket no está vacío
- [ ] Messaging Sender ID no está vacío
- [ ] App ID no está vacío
- [ ] Ningún campo tiene espacios al inicio o final
- [ ] Ningún campo tiene comillas

---

## 🎯 EJEMPLO COMPLETO

### En Firebase Console ves:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB9876543210zyxwvutsrqponmlkjihgfedcba",
  authDomain: "mi-proyecto-ejemplo.firebaseapp.com",
  projectId: "mi-proyecto-ejemplo",
  storageBucket: "mi-proyecto-ejemplo.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:fedcba9876543210fedcba98",
  measurementId: "G-XYZABC9876"
};
```

### En tu página pegas:

| Campo | Valor que pegas |
|-------|-----------------|
| API Key | `AIzaSyB9876543210zyxwvutsrqponmlkjihgfedcba` |
| Auth Domain | `mi-proyecto-ejemplo.firebaseapp.com` |
| Project ID | `mi-proyecto-ejemplo` |
| Storage Bucket | `mi-proyecto-ejemplo.appspot.com` |
| Messaging Sender ID | `987654321098` |
| App ID | `1:987654321098:web:fedcba9876543210fedcba98` |

---

## 🔐 SEGURIDAD

⚠️ **IMPORTANTE:**

- **NO subas tus credenciales a GitHub**
- **NO compartas tus credenciales públicamente**
- Las credenciales están guardadas en tu navegador (localStorage)
- Si necesitas cambiarlas, usa el botón "⚙️ Configurar Nube" nuevamente

---

## 🆘 SI NO FUNCIONA

### "Error al conectar"
1. Verifica que todos los campos estén llenos
2. Verifica que no haya espacios extra
3. Verifica que el proyecto de Firebase esté activo
4. Intenta desconectar y conectar nuevamente

### "Permission denied"
1. Ve a Firebase Console → Firestore Database → Reglas
2. Verifica que las reglas sean las correctas
3. Publica las reglas nuevamente

### "No se sincroniza"
1. Verifica que el botón diga "🟢 Nube Activa"
2. Recarga la página
3. Verifica tu conexión a internet

---

## 📞 AYUDA ADICIONAL

Si tienes problemas copiando las credenciales:

1. Lee la guía completa: `CONFIGURAR_FIREBASE_PASO_A_PASO.md`
2. Lee la guía rápida: `FIREBASE_RAPIDO.md`
3. Consulta la documentación oficial: https://firebase.google.com/docs

---

**¡Ahora puedes copiar tus credenciales correctamente!** 🚀
