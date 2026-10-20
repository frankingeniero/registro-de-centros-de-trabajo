# 📤 Subir tu Proyecto a GitHub - Paso a Paso

## Paso 1: Crear Cuenta en GitHub

1. Ve a https://github.com/
2. Clic en "Sign up"
3. Completa el formulario
4. Verifica tu correo electrónico

## Paso 2: Instalar Git

### Windows:
1. Descarga desde: https://git-scm.com/download/win
2. Instala con las opciones por defecto

### Mac:
```bash
brew install git
```

### Linux:
```bash
sudo apt-get install git
```

### Verificar instalación:
```bash
git --version
```

## Paso 3: Configurar Git

```bash
# Configura tu nombre
git config --global user.name "Tu Nombre"

# Configura tu correo (el mismo de GitHub)
git config --global user.email "tu-correo@ejemplo.com"
```

## Paso 4: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `registro-centros-trabajo`
3. **Description:** "Sistema de registro de centros de trabajo en Venezuela"
4. **Public** (recomendado) o **Private**
5. **NO** marques "Add a README file" (ya tienes uno)
6. **NO** marques "Add .gitignore" (ya tienes uno)
7. **NO** marques "Choose a license"
8. Clic en "Create repository"

## Paso 5: Subir tu Código

### Opción A: Desde Terminal (Recomendada)

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Primera versión del sistema"

# Conectar con GitHub (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/registro-centros-trabajo.git

# Renombrar rama principal
git branch -M main

# Subir el código
git push -u origin main
```

GitHub te pedirá tus credenciales:
- **Username:** Tu usuario de GitHub
- **Password:** Tu token de acceso personal (no tu contraseña)

### Crear Token de Acceso Personal:

1. Ve a https://github.com/settings/tokens
2. Clic en "Generate new token" → "Generate new token (classic)"
3. **Note:** "Subir proyecto"
4. **Expiration:** 90 días (o lo que prefieras)
5. **Select scopes:** Marca `repo` (todo)
6. Clic en "Generate token"
7. **COPIA** el token (solo se muestra una vez)
8. Usa este token como contraseña cuando Git lo solicite

### Opción B: GitHub Desktop (Más Fácil)

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Inicia sesión con tu cuenta de GitHub
3. Clic en "Add" → "Existing Repository"
4. Selecciona la carpeta de tu proyecto
5. Escribe un resumen del commit: "Primera versión"
6. Clic en "Commit to main"
7. Clic en "Publish repository"
8. Selecciona tu repositorio existente
9. Clic en "Publish repository"

## Paso 6: Verificar en GitHub

1. Ve a https://github.com/TU-USUARIO/registro-centros-trabajo
2. Recarga la página
3. Deberías ver todos tus archivos

## Paso 7: Actualizaciones Futuras

Cuando hagas cambios en tu código:

```bash
# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

## 🚀 Desplegar tu Aplicación

Una vez en GitHub, puedes desplegar fácilmente:

### Opción 1: Vercel (Recomendada)

1. Ve a https://vercel.com
2. Clic en "Sign Up" → "Continue with GitHub"
3. Autoriza Vercel
4. Clic en "Import Project"
5. Selecciona tu repositorio
6. Clic en "Deploy"
7. ¡Listo! En 2 minutos tendrás tu URL

### Opción 2: Netlify

1. Ve a https://www.netlify.com/
2. Clic en "Sign up" → "GitHub"
3. Autoriza Netlify
4. Clic en "Add new site" → "Import an existing project"
5. Selecciona GitHub y tu repositorio
6. Configura:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Clic en "Deploy site"

### Opción 3: Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar hosting
firebase init hosting

# Responde:
# - Project: elige tu proyecto
# - Public directory: dist
# - Single-page app: Yes
# - GitHub: No

# Construir proyecto
npm run build

# Desplegar
firebase deploy --only hosting
```

## 📋 Comandos Útiles de Git

```bash
# Ver estado del repositorio
git status

# Ver historial de commits
git log

# Descargar cambios de GitHub
git pull

# Crear nueva rama
git checkout -b nueva-funcionalidad

# Volver a la rama principal
git checkout main

# Ver diferencias
git diff

# Deshacer cambios (¡cuidado!)
git reset --hard HEAD
```

## ⚠️ Solución de Problemas

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/registro-centros-trabajo.git
```

### Error: "Updates were rejected because the remote contains work"
```bash
git pull origin main --rebase
git push -u origin main
```

### Error: "Authentication failed"
- Verifica tu token de acceso personal
- Genera un nuevo token si es necesario

### Los archivos no se suben
- Verifica que no estén en `.gitignore`
- Ejecuta `git status` para ver qué archivos están pendientes

## 🎉 ¡Listo!

Tu proyecto está ahora en GitHub y puedes:
- ✅ Compartirlo con otros
- ✅ Colaborar con más desarrolladores
- ✅ Desplegarlo en Vercel/Netlify/Firebase
- ✅ Mantener un historial de cambios

---

**¡Éxito con tu repositorio!** 🚀
