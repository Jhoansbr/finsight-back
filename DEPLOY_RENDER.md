# 🚀 Guía de Despliegue en Render - MIDAS Backend

Esta guía te muestra cómo publicar tu backend en Render para consumirlo desde tu app móvil.

## 📋 Prerrequisitos

- ✅ Cuenta en Render (gratuita): https://render.com
- ✅ Tu código en GitHub (crea un repo si no lo tienes)
- ✅ Tu base de datos PostgreSQL ya está en Render ✅ (ya la tienes)

## 🎯 Pasos para Desplegar

### 1️⃣ Preparar el Código para Producción

#### 1.1 Crear archivo `render.yaml` (Opcional pero recomendado)

Crea este archivo en la raíz del proyecto:

```yaml
services:
  - type: web
    name: midas-backend
    env: node
    buildCommand: npm install && npm run prisma:generate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: appfinanciera
          property: connectionString
```

#### 1.2 Verificar `package.json`

Asegúrate de que tenga el script `start`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "prisma:generate": "prisma generate"
  }
}
```

✅ Ya lo tienes configurado correctamente.

#### 1.3 Crear `.gitignore` (Ya existe)

Verifica que incluya:

```
node_modules/
.env
logs/
*.log
```

✅ Ya está configurado.

### 2️⃣ Subir a GitHub

Si aún no tienes tu código en GitHub:

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar archivos
git add .

# Commit
git commit -m "Backend MIDAS listo para deploy"

# Crear repo en GitHub y luego:
git remote add origin https://github.com/tu-usuario/finsight-back.git
git branch -M main
git push -u origin main
```

### 3️⃣ Crear Web Service en Render

1. Ve a https://dashboard.render.com/
2. Click en **"New +"** (arriba a la derecha)
3. Selecciona **"Web Service"**

#### 3.1 Conectar Repositorio

4. Click en **"Connect a repository"**
5. Si es tu primera vez, autoriza a Render con GitHub
6. Selecciona tu repositorio `finsight-back`
7. Click **"Connect"**

#### 3.2 Configurar el Web Service

Completa los campos:

**Name:**
```
midas-backend
```
(Render creará la URL: `https://midas-backend.onrender.com`)

**Region:**
```
Oregon (US West)
```
(Misma región que tu base de datos para menor latencia)

**Branch:**
```
main
```

**Root Directory:**
```
(dejar vacío)
```

**Environment:**
```
Node
```

**Build Command:**
```
npm install && npm run prisma:generate
```

**Start Command:**
```
npm start
```

**Instance Type:**
```
Free
```
(Suficiente para empezar, puedes upgradear después)

### 4️⃣ Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

#### Variables Requeridas:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `API_VERSION` | `v1` |
| `DATABASE_URL` | `postgresql://appfinanciera_user:HkSY52XRNtlaD63mMP4ioeiZym1qLXXr@dpg-d47n8oi4d50c738a309g-a.oregon-postgres.render.com/appfinanciera` |
| `JWT_SECRET` | `GENERA_UNA_CLAVE_SEGURA_AQUI` |
| `JWT_REFRESH_SECRET` | `GENERA_OTRA_CLAVE_SEGURA_AQUI` |
| `JWT_EXPIRES_IN` | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` |
| `BCRYPT_SALT_ROUNDS` | `10` |
| `LOG_LEVEL` | `info` |
| `DEFAULT_CURRENCY` | `COP` |
| `DEFAULT_TIMEZONE` | `America/Bogota` |
| `DEFAULT_LANGUAGE` | `es` |

**⚠️ IMPORTANTE:**

Para `JWT_SECRET` y `JWT_REFRESH_SECRET`, genera claves seguras:

```bash
# En tu terminal local, genera claves random:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecuta ese comando 2 veces y usa los resultados para cada secret.

#### Conectar la Base de Datos (Más fácil):

En lugar de poner el `DATABASE_URL` manualmente, puedes:

1. En la sección **"Environment Variables"**
2. Click en **"Add from Database"**
3. Selecciona tu base de datos `appfinanciera`
4. Render conectará automáticamente

### 5️⃣ Desplegar

1. Revisa que todo esté bien configurado
2. Click en **"Create Web Service"**
3. Render empezará a construir y desplegar automáticamente

Verás los logs en tiempo real:

```
==> Cloning from GitHub...
==> Running build command: npm install && npm run prisma:generate
==> Starting service with: npm start
==> ✅ Database connected successfully
==> 🚀 Server running on port 3000
==> Your service is live 🎉
```

### 6️⃣ Verificar el Despliegue

Una vez que diga **"Your service is live"**, tu backend estará en:

```
https://midas-backend.onrender.com
```

#### Probar Endpoints:

**Health Check:**
```
https://midas-backend.onrender.com/health
```

**Documentación Swagger:**
```
https://midas-backend.onrender.com/api-docs
```

**API Base:**
```
https://midas-backend.onrender.com/api/v1
```

### 7️⃣ Ejecutar Seeds (Primera vez)

Si necesitas cargar las categorías, tipos de pago y frecuencias:

#### Opción 1: Shell de Render

1. En el dashboard de tu web service
2. Ve a la pestaña **"Shell"**
3. Click en **"Launch Shell"**
4. Ejecuta:
```bash
npm run prisma:seed
```

#### Opción 2: Agregar a Build Command

Modifica el **Build Command** para que incluya los seeds:

```
npm install && npm run prisma:generate && npm run prisma:seed
```

**⚠️ Cuidado:** Esto ejecutará los seeds cada vez que hagas deploy.

## 📱 Conectar Flutter con Render

En tu app Flutter, cambia la URL base:

```dart
class ApiConfig {
  // Producción
  static const String baseUrl = 'https://midas-backend.onrender.com/api/v1';
  
  // Desarrollo
  // static const String baseUrl = 'http://10.0.2.2:3000/api/v1';
}
```

## 🔄 Actualizar el Backend

Cada vez que hagas cambios:

```bash
# 1. Commit cambios
git add .
git commit -m "Actualización del backend"

# 2. Push a GitHub
git push origin main
```

Render detectará el cambio y **re-desplegará automáticamente** 🎉

## 🎛️ Configuración Adicional (Opcional)

### Auto-Deploy

En Render, el **Auto-Deploy** está activado por defecto. Cada push a `main` re-despliega.

Para desactivarlo:
1. Ve a **Settings** → **Build & Deploy**
2. Desactiva **"Auto-Deploy"**

### Custom Domain

Para usar tu propio dominio:

1. Ve a **Settings** → **Custom Domains**
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

### Health Checks

Render verifica automáticamente tu endpoint `/health`. Si quieres configurarlo:

1. Ve a **Settings** → **Health Check**
2. Path: `/health`
3. Ya está configurado por defecto

## 🐛 Troubleshooting

### Error: "Build failed"

**Revisa los logs** y verifica:
- ✅ `package.json` está en la raíz
- ✅ Todas las dependencias están en `package.json`
- ✅ Build command es correcto

### Error: "Can't reach database"

- ✅ Verifica que `DATABASE_URL` esté correcta
- ✅ O usa "Add from Database" para conectar automáticamente
- ✅ Asegúrate de que la BD esté en la misma región

### Error: "Application failed to respond"

- ✅ Verifica que el puerto sea `3000` o usa `process.env.PORT`
- ✅ Revisa los logs en Render

### El servicio se "duerme" (Free tier)

En el plan gratuito, Render "duerme" tu servicio después de 15 minutos de inactividad. La primera petición después tomará ~30 segundos.

**Soluciones:**

1. **Upgrade a plan pago** ($7/mes)
2. **Usar un ping service** para mantenerlo despierto (no recomendado en free tier)
3. **Aceptar la latencia inicial** (lo más común en desarrollo)

## 💰 Costos

| Plan | Precio | Características |
|------|--------|-----------------|
| **Free** | $0 | 750 horas/mes, se duerme después de 15 min inactividad |
| **Starter** | $7/mes | Siempre activo, más recursos |
| **Standard** | $25/mes | Más CPU, RAM, mejor rendimiento |

**Recomendación:** Empieza con Free para desarrollo, upgrade a Starter cuando publiques la app.

## 🔐 Seguridad en Producción

### Variables de Entorno

✅ Nunca subas `.env` a GitHub
✅ Usa secretos diferentes en producción
✅ Cambia `JWT_SECRET` y `JWT_REFRESH_SECRET`

### CORS

Para producción, configura orígenes específicos:

```env
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```

### HTTPS

Render proporciona HTTPS automáticamente ✅

## 📊 Monitoreo

### Logs

Para ver logs en tiempo real:

1. En el dashboard de tu servicio
2. Ve a **"Logs"**
3. Los logs se actualizan automáticamente

### Métricas

1. Ve a **"Metrics"**
2. Verás:
   - CPU Usage
   - Memory Usage
   - Request Rate
   - Response Time

## 🎉 Checklist de Despliegue

- [ ] ✅ Código subido a GitHub
- [ ] ✅ Web Service creado en Render
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Base de datos conectada
- [ ] ✅ Build exitoso
- [ ] ✅ Servicio "live"
- [ ] ✅ Health check funciona
- [ ] ✅ Swagger accesible
- [ ] ✅ Seeds ejecutados (si es necesario)
- [ ] ✅ Flutter configurado con nueva URL

## 📞 URLs Finales

Una vez desplegado:

- **API Base:** `https://midas-backend.onrender.com/api/v1`
- **Health:** `https://midas-backend.onrender.com/health`
- **Docs:** `https://midas-backend.onrender.com/api-docs`

## 🔗 Probar con Postman

En Postman, crea un nuevo environment **"MIDAS Production"**:

| Variable | Value |
|----------|-------|
| `base_url` | `https://midas-backend.onrender.com/api/v1` |

Luego usa los mismos requests pero con el environment de producción.

---

**¡Tu backend está en producción! 🚀**

Ahora tu app Flutter puede consumir la API desde cualquier lugar del mundo.

