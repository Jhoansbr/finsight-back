# 🚀 Guía de Inicio Rápido - MIDAS

Esta guía te ayudará a poner en marcha el backend de MIDAS en menos de 5 minutos.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- ✅ Node.js v18+ ([Descargar](https://nodejs.org/))
- ✅ PostgreSQL v13+ ([Descargar](https://www.postgresql.org/download/))
- ✅ Git ([Descargar](https://git-scm.com/))

## ⚡ Instalación Rápida

### 1. Clonar e Instalar

```bash
# Clonar el repositorio
git clone <repository-url>
cd finsight-back

# Instalar dependencias
npm install
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos en PostgreSQL
createdb midas_db

# O si estás en Windows con psql:
psql -U postgres
CREATE DATABASE midas_db;
\q
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (copia de `.env.example`):

```bash
# Linux/Mac
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

**Edita el archivo `.env`** y actualiza la URL de la base de datos:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/midas_db?schema=public"
```

Reemplaza `tu_usuario` y `tu_password` con tus credenciales de PostgreSQL.

### 4. Configurar Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Si es una BD nueva, ejecutar migraciones
# (Esto creará todas las tablas)
npm run prisma:migrate

# Cargar datos iniciales
npm run prisma:seed
```

### 5. Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

🎉 **¡Listo!** El servidor debería estar corriendo en `http://localhost:3000`

## 🧪 Verificar que Funciona

### 1. Health Check

Abre tu navegador o usa curl:

```bash
curl http://localhost:3000/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "MIDAS API is running",
  "version": "v1",
  "timestamp": "2024-01-XX..."
}
```

### 2. Ver Documentación

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

### 3. Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "nombre": "Usuario",
    "apellido": "Prueba"
  }'
```

Deberías recibir un token de acceso.

### 4. Probar con el Token

Copia el `accessToken` de la respuesta anterior y úsalo:

```bash
curl -X GET http://localhost:3000/api/v1/dashboard/resumen \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

## 🐳 Con Docker (Alternativa)

Si prefieres usar Docker:

```bash
# Iniciar todo (PostgreSQL + API)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La API estará en `http://localhost:3000`

## 📱 Conectar con Flutter

En tu app Flutter, configura la URL base:

```dart
class ApiConfig {
  // Desarrollo local
  static const String baseUrl = 'http://localhost:3000/api/v1';
  
  // Si usas emulador Android
  // static const String baseUrl = 'http://10.0.2.2:3000/api/v1';
  
  // Si usas dispositivo físico en la misma red
  // static const String baseUrl = 'http://TU_IP_LOCAL:3000/api/v1';
}
```

## 🔧 Comandos Útiles

```bash
# Ver base de datos con GUI
npm run prisma:studio

# Ejecutar tests
npm test

# Ver logs en tiempo real
tail -f logs/combined.log

# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## ❓ Problemas Comunes

### Error: "Can't reach database server"

**Solución**: Verifica que PostgreSQL esté corriendo:

```bash
# Linux
sudo systemctl status postgresql

# Mac
brew services list

# Windows
# Verifica en Servicios que PostgreSQL esté iniciado
```

### Error: "JWT_SECRET is not defined"

**Solución**: Asegúrate de que el archivo `.env` existe y tiene todas las variables necesarias.

### Error: "Port 3000 already in use"

**Solución**: Cambia el puerto en el archivo `.env`:

```env
PORT=3001
```

### Prisma no genera las tablas

**Solución**: Ejecuta manualmente las migraciones:

```bash
npx prisma migrate dev --name init
```

## 📚 Próximos Pasos

1. ✅ Explora la [documentación completa](README.md)
2. ✅ Prueba los endpoints en [Swagger](http://localhost:3000/api-docs)
3. ✅ Revisa los [ejemplos de uso](#ejemplos-de-uso)
4. ✅ Lee sobre [autenticación](#autenticación)

## 💡 Ejemplos de Uso

### Crear un Ingreso

```bash
curl -X POST http://localhost:3000/api/v1/ingresos \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoriaId": 1,
    "monto": 5000000,
    "descripcion": "Salario de Enero",
    "fecha": "2024-01-31",
    "tipoPagoId": 4
  }'
```

### Crear un Gasto

```bash
curl -X POST http://localhost:3000/api/v1/gastos \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoriaId": 8,
    "monto": 250000,
    "descripcion": "Compra del mes",
    "fecha": "2024-01-15",
    "tipoPagoId": 1
  }'
```

### Ver Resumen Financiero

```bash
curl -X GET http://localhost:3000/api/v1/dashboard/resumen \
  -H "Authorization: Bearer TU_TOKEN"
```

### Crear Meta de Ahorro

```bash
curl -X POST http://localhost:3000/api/v1/metas-ahorros \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Vacaciones 2024",
    "montoObjetivo": 3000000,
    "fechaInicio": "2024-01-01",
    "fechaObjetivo": "2024-12-01",
    "prioridad": "alta"
  }'
```

## 🎯 Tips de Desarrollo

1. **Usa Prisma Studio** para ver y editar datos fácilmente:
   ```bash
   npm run prisma:studio
   ```

2. **Documenta mientras desarrollas**: Los comentarios Swagger están en las rutas

3. **Prueba con Postman**: Importa la colección desde Swagger (`/api-docs`)

4. **Usa los logs**: Revisa `logs/combined.log` para debugging

5. **Variables de entorno**: Nunca subas `.env` a git, usa `.env.example`

## 📞 Soporte

¿Problemas? ¿Preguntas?

- 📖 Lee la [documentación completa](README.md)
- 💬 Abre un issue en GitHub
- 📧 Email: soporte@midas.com

---

**¡Feliz desarrollo! 🚀**

