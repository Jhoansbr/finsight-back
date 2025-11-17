# 🐳 Guía de Despliegue con Docker - MIDAS Backend

## ✨ Ventajas de Usar Docker

✅ **Portabilidad** - Funciona igual en todas partes
✅ **Aislamiento** - Entorno consistente y predecible
✅ **Multi-plataforma** - Despliega en Render, Railway, Fly.io, AWS, etc.
✅ **Reproducibilidad** - Mismo entorno en desarrollo y producción
✅ **Optimización** - Build de múltiples etapas para menor tamaño

## 🚀 Opción 1: Desplegar en Render con Docker (Recomendado)

### Paso 1: Subir a GitHub

```bash
git add .
git commit -m "Backend con Docker listo"
git push origin main
```

### Paso 2: Configurar en Render

1. Ve a https://dashboard.render.com/
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio GitHub `finsight-back`
4. **IMPORTANTE**: Selecciona **"Docker"** como Environment

### Paso 3: Configuración Manual

Si Render no detecta el `render-docker.yaml` automáticamente:

**Name:**
```
midas-backend
```

**Region:**
```
Oregon (US West)
```

**Branch:**
```
main
```

**Environment:**
```
Docker
```

**Dockerfile Path:**
```
./Dockerfile
```

**Docker Build Context Directory:**
```
.
```

### Paso 4: Variables de Entorno

En **Environment Variables**, agrega:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | Tu URL de PostgreSQL de Render |
| `JWT_SECRET` | Genera con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Genera otro |
| `CORS_ORIGIN` | `*` (o tu dominio específico) |

**Tip:** Usa **"Add from Database"** para conectar automáticamente tu PostgreSQL.

### Paso 5: Desplegar

Click **"Create Web Service"**

Verás:
```
==> Cloning from GitHub...
==> Building Docker image...
==> Step 1/20 : FROM node:18-alpine AS builder
==> Step 2/20 : WORKDIR /usr/src/app
...
==> Successfully built
==> Starting container...
==> ✅ Database connected successfully
==> 🚀 Server running on port 3000
==> Your service is live 🎉
```

## 🖥️ Opción 2: Probar Localmente con Docker

### Construir la Imagen

```bash
# Construir la imagen
docker build -t midas-backend .

# Ver la imagen creada
docker images | grep midas-backend
```

### Ejecutar el Contenedor

```bash
# Crear archivo .env.docker con tus variables
cat > .env.docker << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://appfinanciera_user:HkSY52XRNtlaD63mMP4ioeiZym1qLXXr@dpg-d47n8oi4d50c738a309g-a.oregon-postgres.render.com/appfinanciera
JWT_SECRET=tu_secret_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
CORS_ORIGIN=*
EOF

# Ejecutar el contenedor
docker run -d \
  --name midas-api \
  -p 3000:3000 \
  --env-file .env.docker \
  midas-backend

# Ver logs
docker logs -f midas-api

# Verificar que funciona
curl http://localhost:3000/health
```

### Detener y Limpiar

```bash
# Detener contenedor
docker stop midas-api

# Eliminar contenedor
docker rm midas-api

# Eliminar imagen
docker rmi midas-backend
```

## 🐙 Opción 3: Docker Compose (Para Testing Local)

### Ejecutar con Docker Compose

```bash
# Crear .env con tus variables (usa el .env existente)

# Iniciar
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Detener
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Opción 4: Otros Servicios Cloud

### Railway

1. Ve a https://railway.app/
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona tu repo
4. Railway detectará el Dockerfile automáticamente
5. Agrega variables de entorno
6. Deploy automático

### Fly.io

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch (desde la raíz del proyecto)
flyctl launch

# Deploy
flyctl deploy
```

### AWS ECS / Google Cloud Run / Azure

El Dockerfile está optimizado para funcionar en cualquiera de estas plataformas.

## 📦 Características del Dockerfile

### Multi-stage Build

```dockerfile
# Stage 1: Builder - Instala dependencias y genera Prisma
FROM node:18-alpine AS builder
...

# Stage 2: Production - Solo lo necesario para correr
FROM node:18-alpine
...
```

**Resultado:** Imagen final más pequeña (~150-200 MB)

### Seguridad

- ✅ Usuario no-root (`nodejs`)
- ✅ Solo dependencias de producción
- ✅ OpenSSL incluido (para Prisma)
- ✅ Permisos correctos en archivos

### Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health')"
```

Render/Docker monitoreará automáticamente `/health`

### Volúmenes para Logs

```yaml
volumes:
  - ./logs:/usr/src/app/logs
  - ./uploads:/usr/src/app/uploads
  - ./reports:/usr/src/app/reports
```

Los logs persisten incluso si reinicias el contenedor.

## 🔍 Verificar el Despliegue

### En Render

Tu API estará en:
```
https://midas-backend.onrender.com
```

**Verificar:**
```bash
# Health check
curl https://midas-backend.onrender.com/health

# Documentación
https://midas-backend.onrender.com/api-docs
```

### Logs en Render

1. Ve a tu servicio en Render
2. Click en **"Logs"**
3. Verás los logs del contenedor Docker en tiempo real

## 🐛 Troubleshooting

### Build Failed: "Cannot find module '@prisma/client'"

**Solución:** El Dockerfile ya maneja esto correctamente con multi-stage build.

### Error: "EACCES: permission denied"

**Solución:** El Dockerfile usa usuario `nodejs` no-root y establece permisos correctos.

### Error de Conexión a BD

**Solución:** Verifica que `DATABASE_URL` esté configurada correctamente en Render.

### Contenedor se cierra inmediatamente

**Solución:** Verifica logs:
```bash
docker logs midas-api
```

Usualmente es un error de configuración (DATABASE_URL, JWT_SECRET faltante, etc.)

## 📊 Comparación: Docker vs Node.js Directo

| Característica | Docker | Node.js Directo |
|----------------|--------|-----------------|
| **Portabilidad** | ✅ Alta | ⚠️ Media |
| **Consistencia** | ✅ Garantizada | ⚠️ Depende del servidor |
| **Tamaño** | 150-200 MB | ~50 MB |
| **Build Time** | 2-3 min | 1-2 min |
| **Flexibilidad** | ✅ Alta | ⚠️ Media |
| **Debugging** | ⚠️ Más complejo | ✅ Más fácil |

**Recomendación:** Usa Docker para **producción**, Node.js directo para **desarrollo local**.

## 🎯 Workflow Completo Recomendado

### Desarrollo (Local)

```bash
# Sin Docker - más rápido para desarrollar
npm run dev
```

### Testing (Local con Docker)

```bash
# Con Docker - simular producción
docker-compose -f docker-compose.prod.yml up
```

### Producción (Render)

```bash
# Push a GitHub - Render despliega con Docker automáticamente
git push origin main
```

## 🔐 Seguridad con Docker

### Secrets Management

**Nunca** incluyas secrets en el Dockerfile:

❌ **MAL:**
```dockerfile
ENV JWT_SECRET=my-secret-key-123
```

✅ **BIEN:**
```bash
# Usa variables de entorno de Render
# O archivos .env que no se suben a Git
```

### Escaneo de Vulnerabilidades

```bash
# Escanear imagen con Docker Scout
docker scout cves midas-backend

# O con Snyk
snyk container test midas-backend
```

## 📱 Conectar Flutter

Una vez desplegado, en Flutter:

```dart
class ApiConfig {
  static const String baseUrl = 'https://midas-backend.onrender.com/api/v1';
}
```

## 🔄 Actualizar el Backend

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Actualización"
git push origin main

# 3. Render reconstruirá la imagen Docker automáticamente
# 4. Deploy automático en 2-3 minutos
```

## 🎉 Checklist de Despliegue con Docker

- [ ] ✅ Dockerfile optimizado (multi-stage)
- [ ] ✅ .dockerignore configurado
- [ ] ✅ Código subido a GitHub
- [ ] ✅ Servicio creado en Render con "Docker" como environment
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ DATABASE_URL conectada
- [ ] ✅ Build exitoso
- [ ] ✅ Contenedor corriendo (verde en Render)
- [ ] ✅ Health check funciona
- [ ] ✅ API accesible públicamente

---

## 🚀 Comandos Rápidos

```bash
# Desarrollo local
npm run dev

# Build Docker local
docker build -t midas-backend .

# Run Docker local
docker run -p 3000:3000 --env-file .env.docker midas-backend

# Deploy a Render
git push origin main

# Ver logs en Render
# Dashboard → Tu servicio → Logs
```

---

**Tu backend con Docker está listo para producción en cualquier plataforma.** 🐳🚀

