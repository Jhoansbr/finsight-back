# 🧪 Guía de Pruebas - MIDAS Backend

Esta guía te muestra **paso a paso** cómo probar que todo funciona correctamente.

## 🚀 Paso 1: Preparar el Entorno

### 1.1 Instalar Dependencias

```bash
npm install
```

### 1.2 Configurar Base de Datos

```bash
# Crear la base de datos
createdb midas_db

# Si estás en Windows con psql:
# psql -U postgres
# CREATE DATABASE midas_db;
# \q
```

### 1.3 Configurar Variables de Entorno

Asegúrate de que tu archivo `.env` tenga esto (ya existe en el proyecto):

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/midas_db?schema=public"
JWT_SECRET=midas_super_secret_key_2024_change_in_production
PORT=3000
```

**⚠️ IMPORTANTE**: Reemplaza `postgres` y `tu_password` con tu usuario y contraseña de PostgreSQL.

### 1.4 Configurar Prisma

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Aplicar las migraciones (crear tablas)
npm run prisma:migrate

# Cargar datos iniciales (categorías, tipos de pago, frecuencias)
npm run prisma:seed
```

Deberías ver algo como:
```
🌱 Iniciando seed de la base de datos...
📁 Creando categorías...
✅ 27 categorías creadas
💳 Creando tipos de pago...
✅ 8 tipos de pago creados
📅 Creando frecuencias...
✅ 8 frecuencias creadas
✨ Seed completado exitosamente!
```

## ▶️ Paso 2: Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
✅ Database connected successfully
🚀 Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
🏥 Health Check: http://localhost:3000/health
🔗 API Base URL: http://localhost:3000/api/v1
🌍 Environment: development
```

## ✅ Paso 3: Verificar que Funciona

### 3.1 Health Check

**Opción A - Navegador:**
- Abre: http://localhost:3000/health

**Opción B - Terminal:**
```bash
curl http://localhost:3000/health
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "MIDAS API is running",
  "version": "v1",
  "timestamp": "2024-01-..."
}
```

### 3.2 Ver Swagger (Documentación Interactiva)

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

¡Aquí puedes probar TODOS los endpoints visualmente! 🎉

## 🎮 Paso 4: Pruebas Manuales (Método Fácil con Swagger)

### 4.1 Registrar un Usuario

1. Ve a http://localhost:3000/api-docs
2. Busca **POST /api/v1/auth/register**
3. Click en "Try it out"
4. Pega este JSON:

```json
{
  "email": "test@midas.com",
  "password": "Test1234",
  "nombre": "Usuario",
  "apellido": "Prueba",
  "telefono": "3001234567"
}
```

5. Click en "Execute"

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "test@midas.com",
      "nombre": "Usuario",
      "apellido": "Prueba"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 IMPORTANTE**: Copia el `accessToken` - lo necesitarás para las siguientes pruebas.

### 4.2 Autorizar en Swagger

1. En la parte superior de Swagger, click en **"Authorize"** 🔒
2. Pega tu token en el formato: `Bearer TU_TOKEN_AQUI`
3. Click en "Authorize"

¡Ahora todos los endpoints protegidos funcionarán! ✅

### 4.3 Ver Categorías (Endpoint Público)

1. Busca **GET /api/v1/categorias**
2. Click en "Try it out"
3. Click en "Execute"

Deberías ver las 27 categorías con iconos y colores.

### 4.4 Crear un Ingreso

1. Busca **POST /api/v1/ingresos**
2. Click en "Try it out"
3. Pega:

```json
{
  "categoriaId": 1,
  "monto": 5000000,
  "descripcion": "Salario de Enero",
  "fecha": "2024-01-31",
  "tipoPagoId": 4
}
```

4. Click en "Execute"

### 4.5 Crear un Gasto

1. Busca **POST /api/v1/gastos**
2. Click en "Try it out"
3. Pega:

```json
{
  "categoriaId": 8,
  "monto": 350000,
  "descripcion": "Mercado del mes",
  "fecha": "2024-01-15",
  "tipoPagoId": 1
}
```

4. Click en "Execute"

### 4.6 Ver Dashboard

1. Busca **GET /api/v1/dashboard/resumen**
2. Click en "Try it out"
3. Click en "Execute"

¡Verás tu resumen financiero con los datos que acabas de crear! 🎉

## 🔧 Paso 5: Pruebas con cURL (Terminal)

Si prefieres usar la terminal:

### 5.1 Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@midas.com",
    "password": "Test1234",
    "nombre": "Usuario",
    "apellido": "Dos"
  }'
```

### 5.2 Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@midas.com",
    "password": "Test1234"
  }'
```

**Copia el token de la respuesta.**

### 5.3 Crear Ingreso (con Token)

```bash
curl -X POST http://localhost:3000/api/v1/ingresos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "categoriaId": 1,
    "monto": 3000000,
    "descripcion": "Freelance",
    "fecha": "2024-01-20",
    "tipoPagoId": 4
  }'
```

### 5.4 Ver Dashboard

```bash
curl -X GET http://localhost:3000/api/v1/dashboard/resumen \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🎯 Paso 6: Flujo Completo de Prueba

Aquí un flujo completo para probar todo:

### 6.1 Autenticación ✅

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"Test1234","nombre":"Juan","apellido":"Pérez"}'

# 2. Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"Test1234"}'

# Guarda el token
```

### 6.2 Crear Transacciones 💰

```bash
# Token guardado en variable
TOKEN="tu_token_aqui"

# Crear varios ingresos
curl -X POST http://localhost:3000/api/v1/ingresos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"categoriaId":1,"monto":5000000,"descripcion":"Salario","fecha":"2024-01-31"}'

# Crear varios gastos
curl -X POST http://localhost:3000/api/v1/gastos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"categoriaId":8,"monto":500000,"descripcion":"Supermercado","fecha":"2024-01-15"}'

curl -X POST http://localhost:3000/api/v1/gastos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"categoriaId":9,"monto":200000,"descripcion":"Gasolina","fecha":"2024-01-20"}'
```

### 6.3 Crear Meta de Ahorro 🎯

```bash
curl -X POST http://localhost:3000/api/v1/metas-ahorros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre":"Vacaciones 2024",
    "montoObjetivo":5000000,
    "fechaInicio":"2024-01-01",
    "fechaObjetivo":"2024-12-01",
    "prioridad":"alta"
  }'

# Agregar depósito a la meta (usa el ID que te devuelve)
curl -X POST http://localhost:3000/api/v1/metas-ahorros/1/movimientos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tipoMovimiento":"deposito",
    "monto":500000,
    "descripcion":"Ahorro de enero"
  }'
```

### 6.4 Crear Presupuesto 📊

```bash
# Crear presupuesto
curl -X POST http://localhost:3000/api/v1/presupuestos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre":"Presupuesto Enero 2024",
    "mes":1,
    "anio":2024,
    "montoTotal":3000000
  }'

# Asignar categorías al presupuesto
curl -X POST http://localhost:3000/api/v1/presupuestos/1/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"categoriaId":8,"montoAsignado":800000}'

# Ver progreso
curl -X GET http://localhost:3000/api/v1/presupuestos/1/progreso \
  -H "Authorization: Bearer $TOKEN"
```

### 6.5 Ver Estadísticas 📈

```bash
# Dashboard general
curl -X GET http://localhost:3000/api/v1/dashboard/resumen \
  -H "Authorization: Bearer $TOKEN"

# Tendencias
curl -X GET http://localhost:3000/api/v1/estadisticas/tendencias \
  -H "Authorization: Bearer $TOKEN"

# Gastos por categoría
curl -X GET "http://localhost:3000/api/v1/estadisticas/gastos-categoria?fechaInicio=2024-01-01&fechaFin=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Paso 7: Ver los Datos (Prisma Studio)

Para ver los datos en una interfaz gráfica:

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde puedes:
- Ver todas las tablas
- Editar datos
- Ver relaciones
- Ejecutar queries

## 🧪 Paso 8: Ejecutar Tests Automatizados

```bash
# Ejecutar todos los tests
npm test

# Ver coverage
npm run test:coverage
```

## ✅ Checklist de Pruebas

Marca lo que ya probaste:

### Básico
- [ ] ✅ Health check funciona
- [ ] ✅ Swagger abre correctamente
- [ ] ✅ Base de datos conectada
- [ ] ✅ Seeds cargados

### Autenticación
- [ ] ✅ Registro de usuario
- [ ] ✅ Login correcto
- [ ] ✅ Login con credenciales incorrectas falla
- [ ] ✅ Obtener perfil con token

### Ingresos
- [ ] ✅ Crear ingreso
- [ ] ✅ Listar ingresos
- [ ] ✅ Ver ingreso específico
- [ ] ✅ Actualizar ingreso
- [ ] ✅ Eliminar ingreso

### Gastos
- [ ] ✅ Crear gasto
- [ ] ✅ Listar gastos con filtros
- [ ] ✅ Ver gasto específico
- [ ] ✅ Actualizar gasto
- [ ] ✅ Eliminar gasto

### Metas de Ahorro
- [ ] ✅ Crear meta
- [ ] ✅ Agregar depósito
- [ ] ✅ Agregar retiro
- [ ] ✅ Ver progreso
- [ ] ✅ Listar movimientos

### Presupuestos
- [ ] ✅ Crear presupuesto
- [ ] ✅ Asignar categorías
- [ ] ✅ Ver progreso vs gastos reales

### Dashboard
- [ ] ✅ Resumen general
- [ ] ✅ Resumen mensual
- [ ] ✅ Tendencias
- [ ] ✅ Gastos por categoría

## 🐛 Problemas Comunes

### Error: "Can't reach database server"

**Solución:**
```bash
# Verifica que PostgreSQL esté corriendo
# Windows: Servicios > PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Verifica tu DATABASE_URL en .env
```

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Cambia el puerto en .env
PORT=3001
```

### Error: "JWT_SECRET is not defined"

**Solución:**
- Asegúrate de que existe el archivo `.env`
- Verifica que tenga `JWT_SECRET=...`

### Error al crear ingreso/gasto: "Invalid categoriaId"

**Solución:**
```bash
# Ejecuta los seeds
npm run prisma:seed
```

## 📱 Paso 9: Probar desde Flutter

Una vez que todo funcione en Swagger/cURL, puedes usar este código en Flutter:

```dart
// Test de conexión
Future<void> testBackend() async {
  final dio = Dio(BaseOptions(
    baseUrl: 'http://10.0.2.2:3000/api/v1', // Android emulator
    // baseUrl: 'http://localhost:3000/api/v1', // iOS simulator
  ));
  
  try {
    // 1. Health check
    final health = await dio.get('/health');
    print('Health: ${health.data}');
    
    // 2. Registrar
    final register = await dio.post('/auth/register', data: {
      'email': 'flutter@test.com',
      'password': 'Test1234',
      'nombre': 'Flutter',
      'apellido': 'User',
    });
    print('Register: ${register.data}');
    
    final token = register.data['data']['accessToken'];
    
    // 3. Dashboard
    final dashboard = await dio.get(
      '/dashboard/resumen',
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    print('Dashboard: ${dashboard.data}');
    
    print('✅ ¡Todo funciona!');
  } catch (e) {
    print('❌ Error: $e');
  }
}
```

## 🎉 ¡Listo!

Si completaste todos los pasos, tu backend está **100% funcional** y listo para usarse con Flutter.

## 📞 Ayuda Adicional

- **Swagger**: http://localhost:3000/api-docs (La mejor forma de probar)
- **Prisma Studio**: `npm run prisma:studio`
- **Logs**: Revisa `logs/combined.log`

---

**¿Algún error?** Revisa los logs en la consola donde corre el servidor.

