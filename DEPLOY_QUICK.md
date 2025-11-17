# 🚀 Guía Rápida de Despliegue en Render

## ✅ Tu código YA está listo para Render

He configurado todo para que funcione perfectamente en producción.

## 📋 Pasos para Desplegar (5 minutos)

### 1️⃣ Subir a GitHub

```bash
# Si ya tienes git iniciado, solo haz:
git add .
git commit -m "Backend listo para producción"
git push origin main

# Si NO tienes git iniciado:
git init
git add .
git commit -m "Backend MIDAS listo para Render"
git branch -M main
# Crea un repo en GitHub, luego:
git remote add origin https://github.com/Jhoansbr/finsight-back.git
git push -u origin main
```

### 2️⃣ Desplegar en Render (Automático)

1. Ve a https://dashboard.render.com/
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio GitHub `finsight-back`
4. **¡Render detectará automáticamente el archivo `render.yaml`!** ✨
5. Click **"Apply"** para usar la configuración automática

**Render configurará AUTOMÁTICAMENTE:**
- ✅ Build command
- ✅ Start command
- ✅ Variables de entorno
- ✅ Conexión a tu base de datos existente
- ✅ Health checks

### 3️⃣ Configurar Solo 2 Secrets (Obligatorio)

Render generará los JWT secrets automáticamente, pero si quieres usar tus propios:

Ve a **Environment** → **Environment Variables** y genera:

**Para JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Para JWT_REFRESH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia cada resultado y pégalos en Render.

### 4️⃣ Verificar Conexión a Base de Datos

En **Environment Variables**, asegúrate de que:

- `DATABASE_URL` apunte a tu base de datos de Render existente
- Si no aparece, agrégala manualmente:
  ```
  postgresql://appfinanciera_user:HkSY52XRNtlaD63mMP4ioeiZym1qLXXr@dpg-d47n8oi4d50c738a309g-a.oregon-postgres.render.com/appfinanciera
  ```

### 5️⃣ Desplegar

Click **"Create Web Service"** o **"Manual Deploy"**

Verás los logs en tiempo real:

```
==> Cloning from GitHub...
==> Running build command: npm install && npx prisma generate
==> Prisma Client generated
==> Starting service: npm start
==> ✅ Database connected successfully
==> 🚀 Server running on port 3000
==> Your service is live 🎉
```

## 🎉 ¡Listo! Tu API está en línea

Tu backend estará disponible en:

```
https://midas-backend.onrender.com
```

(El nombre dependerá de lo que elijas en Render)

### Verificar que funciona:

**Health Check:**
```
https://tu-app.onrender.com/health
```

**Documentación:**
```
https://tu-app.onrender.com/api-docs
```

**API Base:**
```
https://tu-app.onrender.com/api/v1
```

## 📱 Conectar con Flutter

En tu app Flutter:

```dart
class ApiConfig {
  // PRODUCCIÓN - Cambia con tu URL de Render
  static const String baseUrl = 'https://midas-backend.onrender.com/api/v1';
}
```

## 🔄 Actualizar el Backend

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Render **re-desplegará automáticamente** en 2-3 minutos.

## 🧪 Probar con Postman

Crea un environment **"MIDAS Production"**:

| Variable | Value |
|----------|-------|
| `base_url` | `https://tu-app.onrender.com/api/v1` |
| `access_token` | (se llenará automáticamente) |

## ⚙️ Configuración Incluida

He configurado automáticamente:

✅ **Puerto dinámico** - Render asigna el puerto automáticamente
✅ **CORS** - Configurado para permitir todas las apps (puedes restringir después)
✅ **Health checks** - Render monitorea `/health` automáticamente
✅ **Logs** - Accesibles desde el dashboard de Render
✅ **SSL/HTTPS** - Incluido automáticamente
✅ **Auto-deploy** - Cada push a GitHub despliega automáticamente
✅ **Base de datos** - Conectada a tu PostgreSQL de Render
✅ **Secrets** - JWT secrets generados de forma segura

## 🚨 Troubleshooting

### Si el build falla:

1. Verifica que `package.json` esté en la raíz
2. Verifica que todas las dependencias estén en `package.json`
3. Revisa los logs en Render

### Si no conecta a la BD:

1. Verifica que `DATABASE_URL` esté correcta
2. Asegúrate de que la BD esté en la misma región (Oregon)
3. Usa "Add from Database" para conectar automáticamente

### Si el servicio se "duerme":

Es normal en el plan gratuito. La primera petición después de 15 minutos de inactividad tomará ~30 segundos.

**Solución:** Upgrade a plan Starter ($7/mes) para mantenerlo siempre activo.

## 💰 Costos

| Plan | Precio | Características |
|------|--------|-----------------|
| **Free** | $0 | 750 horas/mes, se duerme tras 15 min |
| **Starter** | $7/mes | Siempre activo |

## 📊 Monitoreo

En el dashboard de Render verás:

- **Logs** en tiempo real
- **Métricas** (CPU, RAM, requests)
- **Deployments** históricos
- **Health status**

## 🎯 Checklist de Verificación

Antes de conectar tu app Flutter, verifica:

- [ ] ✅ El servicio está "live" (verde) en Render
- [ ] ✅ `/health` responde correctamente
- [ ] ✅ `/api-docs` muestra la documentación
- [ ] ✅ Puedes hacer `POST /auth/register` desde Postman
- [ ] ✅ La URL de Render está configurada en Flutter

## 🔐 Seguridad en Producción

Para producción real, considera:

1. **CORS específico:**
   ```env
   CORS_ORIGIN=https://tu-dominio.com
   ```

2. **Rate limiting más estricto:**
   ```env
   RATE_LIMIT_MAX_REQUESTS=50
   ```

3. **Secrets únicos:**
   - Genera nuevos JWT secrets
   - No uses los mismos de desarrollo

## 📞 URLs Importantes

Después del despliegue:

- **Dashboard:** https://dashboard.render.com/
- **Tu API:** https://tu-app.onrender.com
- **Health:** https://tu-app.onrender.com/health
- **Docs:** https://tu-app.onrender.com/api-docs
- **Logs:** Dashboard → Tu servicio → Logs

---

## 🎉 ¡Eso es todo!

Tu backend está configurado para funcionar perfectamente en Render.

Solo necesitas:
1. ✅ Push a GitHub
2. ✅ Conectar en Render
3. ✅ Usar la URL en Flutter

**¿Listo para desplegar? Sigue los 5 pasos de arriba.** 🚀

