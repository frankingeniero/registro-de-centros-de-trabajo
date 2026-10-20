# 🌩️ CONFIGURAR TU PÁGINA EN CLOUDFLARE PAGES

## 🎯 ¿POR QUÉ CLOUDFLARE PAGES?

✅ **100% Gratis** para proyectos personales
✅ **CDN Global** (rápido en todo el mundo)
✅ **HTTPS automático**
✅ **Dominio gratuito** `.pages.dev`
✅ **Se conecta con GitHub**
✅ **Despliegues automáticos**
✅ **500 despliegues/mes**
✅ **Ancho de banda ilimitado**

---

## 📋 REQUISITOS PREVIOS

Antes de empezar, necesitas:

1. ✅ Tu código subido a **GitHub** (si no lo has hecho, lee `SUBIR_A_GITHUB.md`)
2. ✅ Una cuenta de **GitHub**
3. ✅ Una cuenta de **Cloudflare** (gratis)

---

## 🚀 PASO 1: CREAR CUENTA EN CLOUDFLARE

1. Ve a https://www.cloudflare.com/
2. Clic en **"Sign Up"** (registro)
3. Ingresa tu **correo electrónico**
4. Crea una **contraseña**
5. Verifica tu correo
6. ¡Listo! Ya tienes tu cuenta

---

## 🚀 PASO 2: ACCEDER A CLOUDFLARE PAGES

1. Inicia sesión en https://dash.cloudflare.com/
2. En el menú lateral izquierdo, busca **"Workers & Pages"**
3. Clic en el botón **"Create"**
4. Selecciona la pestaña **"Pages"**
5. Clic en **"Connect to Git"**

---

## 🚀 PASO 3: CONECTAR CON GITHUB

1. Clic en **"GitHub"**
2. Te pedirá autorización:
   - Si es la primera vez, haz clic en **"Install Cloudflare Pages"**
   - Selecciona tu cuenta de GitHub
   - Elige qué repositorios puede acceder Cloudflare:
     - **"All repositories"** (todos) o
     - **"Only select repositories"** (solo los que elijas)
   - Selecciona tu repositorio `registro-centros-trabajo`
   - Clic en **"Install & Authorize"**

3. Selecciona tu repositorio **`registro-centros-trabajo`**
4. Clic en **"Begin setup"**

---

## 🚀 PASO 4: CONFIGURAR EL PROYECTO

En la pantalla de configuración, completa:

### Framework preset:
- Selecciona: **"Vite"** (o "None")

### Build settings (Configuración de compilación):

| Campo | Valor |
|-------|-------|
| **Project name** | `registro-centros-trabajo` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (dejar por defecto) |

### Environment variables (Opcional):
Si usas variables de entorno para Firebase, agrégalas aquí:

```
VITE_FIREBASE_API_KEY = tu-api-key
VITE_FIREBASE_AUTH_DOMAIN = tu-auth-domain
VITE_FIREBASE_PROJECT_ID = tu-project-id
VITE_FIREBASE_STORAGE_BUCKET = tu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID = tu-sender-id
VITE_FIREBASE_APP_ID = tu-app-id
```

⚠️ **IMPORTANTE:** Si usas el botón "Configurar Nube" en la app, NO necesitas estas variables.

---

## 🚀 PASO 5: DESPLEGAR

1. Revisa que todo esté correcto
2. Clic en **"Save and Deploy"**
3. Espera 2-3 minutos mientras Cloudflare:
   - Descarga tu código de GitHub
   - Instala dependencias (`npm install`)
   - Construye el proyecto (`npm run build`)
   - Despliega los archivos

4. Cuando termine, verás:
   ```
   ✅ Success! Your project has been deployed.
   ```

---

## 🎉 ¡LISTO! TU PÁGINA ESTÁ ONLINE

Cloudflare te dará una URL como:

```
https://registro-centros-trabajo.pages.dev
```

✅ Tu página ya está publicada en internet
✅ Accesible desde cualquier dispositivo
✅ Con HTTPS automático
✅ Con CDN global (rápida en todo el mundo)

---

## 🔧 CONFIGURAR FIREBASE EN TU PÁGINA

Una vez publicada, necesitas configurar Firebase:

1. Abre tu URL: `https://tu-proyecto.pages.dev`
2. En la pantalla de login, busca el botón **"⚙️ Configurar Nube"** (esquina inferior derecha)
3. Pega tus credenciales de Firebase
4. Clic en **"🔗 Conectar"**

✅ ¡Firebase está configurado y la sincronización funciona!

---

## 🔄 DESPLIEGUES AUTOMÁTICOS

Cada vez que hagas cambios en tu código y los subas a GitHub:

```bash
git add .
git commit -m "Nuevos cambios"
git push
```

**Cloudflare detectará automáticamente los cambios y desplegará una nueva versión en 2-3 minutos.**

### Ver historial de despliegues:
1. Ve a tu proyecto en Cloudflare
2. Pestaña **"Deployments"**
3. Verás todos los despliegues con su estado

---

## 🌐 DOMINIO PERSONALIZADO (OPCIONAL)

Si quieres usar tu propio dominio (ej: `registro-centros.com`) en lugar de `.pages.dev`:

### Opción 1: Dominio Gratis
- **Freenom:** https://www.freenom.com/ (dominios `.tk`, `.ml`, `.ga` gratis)
- **GitHub Student Pack:** Dominio `.me` gratis si eres estudiante

### Opción 2: Dominio Pago
- **Namecheap:** Desde $5.98/año
- **Google Domains:** Desde $12/año

### Cómo conectar tu dominio:

1. En Cloudflare, ve a tu proyecto de Pages
2. Pestaña **"Custom domains"**
3. Clic en **"Set up a custom domain"**
4. Escribe tu dominio (ej: `registro-centros.com`)
5. Clic en **"Continue"**
6. Cloudflare te dará instrucciones para configurar los DNS:

**Si tu dominio está en Cloudflare:**
- Los registros se configuran automáticamente

**Si tu dominio está en otro proveedor (GoDaddy, Namecheap, etc.):**
- Agrega un registro **CNAME**:
  - **Name:** `@` o deja vacío
  - **Value:** `tu-proyecto.pages.dev`
  - **TTL:** Auto o 1 hora

7. Espera 5-30 minutos para que los DNS se propaguen
8. ¡Listo! Tu dominio personalizado funcionará con HTTPS automático

---

## ⚙️ CONFIGURACIÓN AVANZADA

### Variables de Entorno

Si necesitas configurar variables de entorno:

1. Ve a tu proyecto en Cloudflare Pages
2. Pestaña **"Settings"** → **"Environment variables"**
3. Clic en **"Add variable"**
4. Agrega tus variables:
   - **Variable name:** `VITE_FIREBASE_API_KEY`
   - **Value:** tu-api-key
5. Repite para cada variable
6. Los cambios se aplicarán en el próximo despliegue

### Redirecciones y Headers

Si necesitas redirecciones o headers personalizados, crea un archivo `_headers` o `_redirects` en la carpeta `public/`:

**Ejemplo de `_redirects`:**
```
/*    /index.html   200
```

**Ejemplo de `_headers`:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

### Protección de Rutas

Si quieres proteger ciertas rutas con contraseña:

1. Ve a **"Settings"** → **"Access"**
2. Configura Cloudflare Access
3. Define qué rutas requieren autenticación

---

## 📊 MONITOREO Y ANALYTICS

Cloudflare ofrece métricas gratuitas:

1. Ve a tu proyecto
2. Pestaña **"Analytics"**
3. Verás:
   - Número de visitas
   - Ancho de banda usado
   - Solicitudes por país
   - Estado de los despliegues

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "Build failed" (Error de compilación)

**Causa:** Error en el código o dependencias

**Solución:**
1. Ve a la pestaña **"Deployments"**
2. Clic en el despliegue fallido
3. Revisa los logs de error
4. Corrige el error en tu código
5. Sube los cambios a GitHub
6. Cloudflare desplegará automáticamente

### "Page not found" (Página no encontrada)

**Causa:** Configuración incorrecta del build

**Solución:**
1. Verifica que el **Build output directory** sea `dist`
2. Verifica que el **Build command** sea `npm run build`
3. Verifica que `npm run build` funcione localmente

### "Firebase not configured"

**Causa:** Firebase no está configurado en la app

**Solución:**
1. Abre tu página publicada
2. Clic en "⚙️ Configurar Nube"
3. Pega las credenciales de Firebase
4. Clic en "Conectar"

### Los cambios no se reflejan

**Causa:** Caché del navegador

**Solución:**
1. Presiona `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
2. O borra la caché del navegador
3. O abre en modo incógnito

### El dominio personalizado no funciona

**Causa:** DNS no se ha propagado

**Solución:**
1. Espera hasta 24 horas
2. Verifica los registros DNS en https://dnschecker.org/
3. Asegúrate de que el CNAME apunte a `tu-proyecto.pages.dev`

---

## 📱 ACCESOS RÁPIDOS

- **Dashboard de Cloudflare:** https://dash.cloudflare.com/
- **Documentación de Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Soporte de Cloudflare:** https://developers.cloudflare.com/pages/platform/support/

---

## ✅ CHECKLIST FINAL

- [ ] Cuenta de Cloudflare creada
- [ ] Código subido a GitHub
- [ ] Proyecto conectado con GitHub
- [ ] Configuración de build correcta (Vite, dist)
- [ ] Primer despliegue exitoso
- [ ] Página accesible en `.pages.dev`
- [ ] Firebase configurado en la app
- [ ] Sincronización en tiempo real funcionando
- [ ] (Opcional) Dominio personalizado configurado

---

## 🎉 ¡FELICIDADES!

Tu página web está:
- ✅ Publicada en Cloudflare Pages
- ✅ Con HTTPS automático
- ✅ Con CDN global
- ✅ Con dominio gratuito `.pages.dev`
- ✅ Con despliegues automáticos
- ✅ Con sincronización en tiempo real
- ✅ Accesible desde cualquier dispositivo

**¡Tu aplicación está lista para el mundo!** 🚀🌍🇻🇪

---

## 💡 CONSEJOS

1. **Mantén tu código actualizado:** Cada push a GitHub desplegará automáticamente
2. **Usa branches:** Puedes tener diferentes versiones (develop, staging, production)
3. **Monitorea los despliegues:** Revisa la pestaña "Deployments" regularmente
4. **Configura alertas:** Cloudflare puede enviarte emails si hay errores
5. **Optimiza el rendimiento:** Cloudflare ofrece optimizaciones automáticas

---

## 🔗 ENLACES ÚTILES

- Crear cuenta: https://www.cloudflare.com/sign-up/
- Dashboard: https://dash.cloudflare.com/
- Documentación: https://developers.cloudflare.com/pages/
- Soporte: https://developers.cloudflare.com/pages/platform/support/

---

**¿Necesitas más ayuda?** Revisa los otros archivos de documentación o consulta la documentación oficial de Cloudflare.
