# 🤖 Guía para Asistente de IA - Integración Backend MIDAS con Flutter

## 📋 Contexto del Proyecto

Soy desarrollador de una aplicación móvil de gestión financiera personal llamada **MIDAS**. Tengo un backend completamente funcional desplegado en Render y necesito ayuda para integrar cada endpoint con mi aplicación Flutter.

---

## 🌐 Información del Backend

### URL Base
```
https://finsight-back.onrender.com/api/v1
```

### Tecnologías del Backend
- **Framework**: Node.js + Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)

### Documentación Interactiva
```
https://finsight-back.onrender.com/api-docs
```

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Registro/Login** → Obtengo `accessToken` y `refreshToken`
2. **Guardar tokens** → Almacenar en Flutter Secure Storage
3. **Usar accessToken** → Agregarlo en header `Authorization: Bearer {token}` en cada request
4. **Renovar token** → Cuando accessToken expire, usar refreshToken

### Tokens

| Token | Duración | Uso |
|-------|----------|-----|
| **accessToken** | 24 horas | Para autenticar cada request |
| **refreshToken** | 7 días | Para renovar el accessToken |

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

```sql
-- Usuarios
usuarios (id_usuario, email, password_hash, nombre, apodo, telegram, whatsapp, ...)

-- Categorías (para ingresos y gastos)
categorias (id_categoria, nombre, descripcion, icono, activo)

-- Tipos de Pago
tipos_pago (id_tipo_pago, nombre, descripcion)

-- Frecuencias
frecuencias (id_frecuencia, nombre, dias_intervalo)

-- Ingresos
ingresos (id_ingreso, id_usuario, id_categoria, nombre, monto, fecha, ...)

-- Gastos
gastos (id_gasto, id_usuario, id_categoria, nombre, monto, fecha, ...)

-- Metas de Ahorro
metas_ahorros (id_meta_ahorro, id_usuario, nombre, monto_objetivo, monto_actual, ...)

-- Ahorros (movimientos de metas)
ahorros (id_ahorro, id_meta_ahorro, id_usuario, tipo_movimiento, monto, ...)

-- Presupuestos
presupuestos (id_presupuesto, id_usuario, anio, mes, monto_total)

-- Presupuesto por Categoría
presupuesto_categorias (id_presupuesto_categoria, id_presupuesto, id_categoria, monto_asignado, monto_gastado)

-- Preferencias de Usuario
preferencias_usuario (id_preferencia, id_usuario, moneda, pais, zona_horaria, idioma, ...)

-- Recordatorios
recordatorios (id_recordatorio, id_usuario, titulo, fecha_recordatorio, ...)
```

---

## 📝 Lista Completa de Endpoints

### 🔐 Autenticación (5 endpoints)

#### 1. Registrar Usuario
```
POST /auth/register
```
**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123",
  "nombre": "Juan Pérez",
  "apodo": "Juanito",           // Opcional
  "telegram": "@juanito",        // Opcional
  "whatsapp": "573001234567"     // Opcional
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 33,
      "email": "usuario@example.com",
      "nombre": "Juan Pérez",
      "apodo": "Juanito",
      "telegram": "@juanito",
      "whatsapp": "573001234567",
      "fotoPerfil": null,
      "fechaRegistro": "2024-11-17T10:00:00.000Z",
      "createdAt": "2024-11-17T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Iniciar Sesión
```
POST /auth/login
```
**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```
**Response (200):** Igual que registro

#### 3. Obtener Perfil
```
GET /auth/me
```
**Headers:**
```
Authorization: Bearer {accessToken}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 33,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "apodo": "Juanito",
    "telegram": "@juanito",
    "whatsapp": "573001234567",
    "fotoPerfil": null,
    "fechaRegistro": "2024-11-17T10:00:00.000Z",
    "createdAt": "2024-11-17T10:00:00.000Z",
    "preferencia": {
      "moneda": "COP",
      "pais": "Colombia",
      "zonaHoraria": "America/Bogota",
      "idioma": "es",
      "notificacionesEmail": true,
      "notificacionesPush": true
    }
  }
}
```

#### 4. Refrescar Token
```
POST /auth/refresh-token
```
**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 5. Cerrar Sesión
```
POST /auth/logout
```
**Headers:**
```
Authorization: Bearer {accessToken}
```

---

### 👤 Usuarios (3 endpoints)

#### 6. Actualizar Perfil
```
PUT /users/profile
```
**Headers:**
```
Authorization: Bearer {accessToken}
```
**Body:**
```json
{
  "nombre": "Juan Carlos",
  "apodo": "JuanC",
  "telegram": "@juanc",
  "whatsapp": "573009876543"
}
```

#### 7. Actualizar Preferencias
```
PUT /users/preferences
```
**Body:**
```json
{
  "moneda": "USD",
  "pais": "Colombia",
  "zonaHoraria": "America/Bogota",
  "idioma": "es",
  "notificacionesEmail": false,
  "notificacionesPush": true
}
```

#### 8. Cambiar Contraseña
```
PUT /users/change-password
```
**Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

---

### 📊 Datos Maestros (3 endpoints)

#### 9. Listar Categorías
```
GET /categorias
GET /categorias?tipo=ingreso
GET /categorias?tipo=gasto
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Salario",
      "descripcion": "Ingresos por trabajo asalariado",
      "icono": "💰",
      "activo": true
    },
    {
      "id": 6,
      "nombre": "Alimentación",
      "descripcion": "Comida y bebidas",
      "icono": "🍔",
      "activo": true
    }
  ]
}
```

#### 10. Listar Tipos de Pago
```
GET /tipos-pago
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "nombre": "Débito"},
    {"id": 2, "nombre": "Crédito"},
    {"id": 3, "nombre": "Efectivo"},
    {"id": 4, "nombre": "Transferencia"}
  ]
}
```

#### 11. Listar Frecuencias
```
GET /frecuencias
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "nombre": "Sin frecuencia", "diasIntervalo": null},
    {"id": 2, "nombre": "Diario", "diasIntervalo": 1},
    {"id": 3, "nombre": "Semanal", "diasIntervalo": 7},
    {"id": 5, "nombre": "Mensual", "diasIntervalo": 30}
  ]
}
```

---

### 💰 Ingresos (5 endpoints)

#### 12. Crear Ingreso
```
POST /ingresos
```
**Body:**
```json
{
  "nombre": "Salario Noviembre",
  "categoriaId": 1,
  "monto": 3000000,
  "fecha": "2024-11-15",
  "descripcion": "Salario mensual",
  "tipoPagoId": 4,
  "esRecurrente": true,
  "frecuenciaId": 5
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 150,
    "usuarioId": 33,
    "categoriaId": 1,
    "nombre": "Salario Noviembre",
    "monto": "3000000.00",
    "fecha": "2024-11-15",
    "descripcion": "Salario mensual",
    "tipoPagoId": 4,
    "esRecurrente": true,
    "frecuenciaId": 5,
    "activo": true,
    "createdAt": "2024-11-17T10:00:00.000Z"
  }
}
```

#### 13. Listar Ingresos
```
GET /ingresos
GET /ingresos?page=1&limit=20
GET /ingresos?fechaInicio=2024-11-01&fechaFin=2024-11-30
GET /ingresos?categoriaId=1
GET /ingresos?esRecurrente=true
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 150,
      "nombre": "Salario Noviembre",
      "monto": "3000000.00",
      "fecha": "2024-11-15",
      "categoria": {
        "id": 1,
        "nombre": "Salario",
        "icono": "💰"
      },
      "tipoPago": {
        "id": 4,
        "nombre": "Transferencia"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### 14. Obtener Ingreso por ID
```
GET /ingresos/{id}
```

#### 15. Actualizar Ingreso
```
PUT /ingresos/{id}
```
**Body:** Mismos campos que crear (todos opcionales)

#### 16. Eliminar Ingreso
```
DELETE /ingresos/{id}
```

---

### 💸 Gastos (5 endpoints)

#### 17. Crear Gasto
```
POST /gastos
```
**Body:**
```json
{
  "nombre": "Mercado del mes",
  "categoriaId": 6,
  "monto": 350000,
  "fecha": "2024-11-15",
  "descripcion": "Compras supermercado",
  "tipoPagoId": 1,
  "esRecurrente": false
}
```

#### 18. Listar Gastos
```
GET /gastos
GET /gastos?page=1&limit=20
GET /gastos?fechaInicio=2024-11-01&fechaFin=2024-11-30
GET /gastos?categoriaId=6
```

#### 19. Obtener Gasto por ID
```
GET /gastos/{id}
```

#### 20. Actualizar Gasto
```
PUT /gastos/{id}
```

#### 21. Eliminar Gasto
```
DELETE /gastos/{id}
```

---

### 🎯 Metas de Ahorro (7 endpoints)

#### 22. Crear Meta de Ahorro
```
POST /metas-ahorros
```
**Body:**
```json
{
  "nombre": "Vacaciones 2025",
  "descripcion": "Viaje a Cartagena",
  "montoObjetivo": 5000000,
  "fechaInicio": "2024-11-01",
  "fechaObjetivo": "2025-06-01"
}
```

#### 23. Listar Metas de Ahorro
```
GET /metas-ahorros
GET /metas-ahorros?estado=en_progreso
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "nombre": "Vacaciones 2025",
      "montoObjetivo": "5000000.00",
      "montoActual": "1500000.00",
      "fechaObjetivo": "2025-06-01",
      "progreso": "30.00"
    }
  ]
}
```

#### 24. Obtener Meta por ID
```
GET /metas-ahorros/{id}
```

#### 25. Actualizar Meta
```
PUT /metas-ahorros/{id}
```

#### 26. Eliminar Meta
```
DELETE /metas-ahorros/{id}
```

#### 27. Agregar Movimiento a Meta (Depósito/Retiro)
```
POST /metas-ahorros/{id}/movimientos
```
**Body (Depósito):**
```json
{
  "tipoMovimiento": "deposito",
  "nombre": "Ahorro Noviembre",
  "monto": 500000,
  "fecha": "2024-11-15",
  "descripcion": "Ahorro del mes"
}
```

**Body (Retiro):**
```json
{
  "tipoMovimiento": "retiro",
  "nombre": "Emergencia",
  "monto": 200000,
  "fecha": "2024-11-20"
}
```

#### 28. Listar Movimientos de una Meta
```
GET /metas-ahorros/{id}/movimientos
```

---

### 📊 Presupuestos (7 endpoints)

#### 29. Crear Presupuesto
```
POST /presupuestos
```
**Body:**
```json
{
  "nombre": "Presupuesto Noviembre 2024",
  "mes": 11,
  "anio": 2024,
  "montoTotal": 3000000,
  "descripcion": "Presupuesto mensual"
}
```

#### 30. Listar Presupuestos
```
GET /presupuestos
GET /presupuestos?mes=11&anio=2024
```

#### 31. Obtener Presupuesto por ID
```
GET /presupuestos/{id}
```

#### 32. Actualizar Presupuesto
```
PUT /presupuestos/{id}
```

#### 33. Eliminar Presupuesto
```
DELETE /presupuestos/{id}
```

#### 34. Asignar Categoría al Presupuesto
```
POST /presupuestos/{id}/categorias
```
**Body:**
```json
{
  "categoriaId": 6,
  "montoAsignado": 800000
}
```

#### 35. Ver Progreso del Presupuesto
```
GET /presupuestos/{id}/progreso
```
**Response:**
```json
{
  "success": true,
  "data": {
    "presupuesto": {
      "id": 5,
      "nombre": "Presupuesto Noviembre 2024",
      "mes": 11,
      "anio": 2024
    },
    "resumen": {
      "totalAsignado": 3000000,
      "totalGastado": 1250000,
      "totalRestante": 1750000,
      "porcentajeTotalUsado": 41.67,
      "excedido": false
    },
    "categorias": [
      {
        "categoriaId": 6,
        "categoriaNombre": "Alimentación",
        "categoriaIcono": "🍔",
        "montoAsignado": 800000,
        "montoGastado": 350000,
        "restante": 450000,
        "porcentajeUsado": 43.75,
        "excedido": false
      }
    ]
  }
}
```

---

### 📈 Dashboard y Estadísticas (5 endpoints)

#### 36. Resumen General
```
GET /dashboard/resumen
```
**Response:**
```json
{
  "success": true,
  "data": {
    "mesActual": {
      "mes": 11,
      "anio": 2024,
      "totalIngresos": 5000000,
      "totalGastos": 2500000,
      "balance": 2500000
    },
    "metasAhorro": {
      "activas": 2,
      "metas": [...]
    },
    "recordatoriosPendientes": 3
  }
}
```

#### 37. Resumen Mensual
```
GET /dashboard/mensual/{mes}/{anio}
```
**Ejemplo:**
```
GET /dashboard/mensual/11/2024
```

#### 38. Tendencias (Últimos 6 meses)
```
GET /estadisticas/tendencias
```

#### 39. Balance Histórico
```
GET /estadisticas/balance-historico
GET /estadisticas/balance-historico?meses=12
```

#### 40. Gastos por Categoría
```
GET /estadisticas/gastos-categoria?fechaInicio=2024-11-01&fechaFin=2024-11-30
```

---

### 🔔 Recordatorios (7 endpoints)

#### 41. Crear Recordatorio
```
POST /recordatorios
```
**Body:**
```json
{
  "titulo": "Pagar servicio de luz",
  "descripcion": "Pago del recibo de energía",
  "fecha": "2024-11-25T09:00:00.000Z",
  "tipo": "pago"
}
```

#### 42. Listar Recordatorios
```
GET /recordatorios
GET /recordatorios?completado=false
```

#### 43. Recordatorios Próximos (7 días)
```
GET /recordatorios/proximos
```

#### 44. Obtener Recordatorio por ID
```
GET /recordatorios/{id}
```

#### 45. Actualizar Recordatorio
```
PUT /recordatorios/{id}
```

#### 46. Marcar como Completado
```
PATCH /recordatorios/{id}/completar
```

#### 47. Eliminar Recordatorio
```
DELETE /recordatorios/{id}
```

---

## ⚠️ Manejo de Errores

### Formato Estándar de Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo",
    "details": {}
  }
}
```

### Códigos de Error Comunes

| HTTP | Code | Descripción |
|------|------|-------------|
| 400 | VALIDATION_ERROR | Datos inválidos |
| 401 | AUTHENTICATION_ERROR | No autenticado |
| 401 | TOKEN_EXPIRED | Token expirado |
| 403 | AUTHORIZATION_ERROR | Sin permisos |
| 404 | NOT_FOUND | Recurso no encontrado |
| 409 | CONFLICT_ERROR | Duplicado (email, etc.) |
| 429 | RATE_LIMIT_EXCEEDED | Demasiadas peticiones |
| 500 | INTERNAL_ERROR | Error del servidor |

---

## 📱 Estructura Recomendada en Flutter

### Arquitectura Sugerida

```
lib/
├── core/
│   ├── constants/
│   │   └── api_constants.dart          # URLs, endpoints
│   ├── network/
│   │   ├── api_client.dart             # Configuración Dio
│   │   ├── interceptors.dart           # Auth interceptor
│   │   └── api_response.dart           # Modelos response
│   └── storage/
│       └── secure_storage.dart         # Tokens
├── data/
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── ingreso_model.dart
│   │   ├── gasto_model.dart
│   │   ├── meta_ahorro_model.dart
│   │   └── ...
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── ingresos_repository.dart
│   │   ├── gastos_repository.dart
│   │   └── ...
│   └── datasources/
│       ├── auth_remote_datasource.dart
│       ├── ingresos_remote_datasource.dart
│       └── ...
├── domain/
│   ├── entities/
│   └── usecases/
└── presentation/
    ├── providers/                      # Riverpod/Provider
    ├── screens/
    └── widgets/
```

---

## 🎯 Lo Que Necesito del Asistente de IA

### Para Cada Endpoint que te Solicite:

1. **Modelo de Datos (Model)**
   - Clase Dart con `fromJson` y `toJson`
   - Manejo de campos nullable
   - Conversión de tipos (String a DateTime, etc.)

2. **Data Source (Remote)**
   - Método con Dio que hace el request
   - Manejo de headers (Authorization)
   - Manejo de errores específicos

3. **Repository**
   - Abstracción del data source
   - Manejo de excepciones
   - Conversión de respuestas a modelos

4. **Provider (Riverpod/GetX/BLoC)**
   - Estado de loading/error/success
   - Métodos para llamar al repository
   - Manejo de estados

5. **Ejemplo de Uso en UI**
   - Cómo llamar al provider
   - Mostrar loading
   - Mostrar errores
   - Actualizar UI con datos

### Ejemplo de Request:

> "Necesito implementar el endpoint de **Crear Gasto** en mi app Flutter con Dio y Riverpod"

### Lo que Espero:

```dart
// 1. Modelo
class Gasto {
  final int id;
  final String nombre;
  final double monto;
  final DateTime fecha;
  // ... resto de campos
  
  factory Gasto.fromJson(Map<String, dynamic> json) { ... }
  Map<String, dynamic> toJson() { ... }
}

// 2. Data Source
class GastosRemoteDataSource {
  final Dio _dio;
  
  Future<Gasto> crearGasto({
    required String nombre,
    required int categoriaId,
    required double monto,
    required DateTime fecha,
    String? descripcion,
  }) async {
    try {
      final response = await _dio.post(
        '/gastos',
        data: {
          'nombre': nombre,
          'categoriaId': categoriaId,
          'monto': monto,
          'fecha': fecha.toIso8601String().split('T')[0],
          if (descripcion != null) 'descripcion': descripcion,
        },
      );
      return Gasto.fromJson(response.data['data']);
    } catch (e) {
      // Manejo de errores
    }
  }
}

// 3. Repository
// 4. Provider
// 5. Ejemplo de uso en Widget
```

---

## 📦 Dependencias Flutter Recomendadas

```yaml
dependencies:
  # HTTP Client
  dio: ^5.4.0
  
  # State Management
  flutter_riverpod: ^2.4.9
  # O provider: ^6.1.1
  # O get: ^4.6.6
  
  # Storage
  flutter_secure_storage: ^9.0.0
  
  # Date formatting
  intl: ^0.18.1
  
  # JSON
  json_annotation: ^4.8.1

dev_dependencies:
  # Code generation
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

---

## 💡 Notas Importantes

1. **Fechas**: El backend espera formato `YYYY-MM-DD` para fechas tipo `Date`
2. **Montos**: Enviar como números, no strings
3. **IDs**: Todos los IDs son integers
4. **Paginación**: Por defecto `page=1, limit=20`
5. **Filtros**: Los query params son opcionales
6. **Headers**: Todos los endpoints protegidos requieren `Authorization: Bearer {token}`
7. **Timeout**: El backend en plan Free de Render puede tardar 30 segundos en despertar en la primera petición

---

## 🔄 Flujo Típico de la App

1. **Usuario abre la app**
   - Verificar si hay token guardado
   - Si hay token: verificar si está vigente (GET /auth/me)
   - Si no hay token: mostrar pantalla de login

2. **Usuario hace login**
   - POST /auth/login
   - Guardar accessToken y refreshToken
   - Navegar a home

3. **Usuario ve dashboard**
   - GET /dashboard/resumen
   - Mostrar resumen financiero

4. **Usuario crea un gasto**
   - Cargar categorías: GET /categorias?tipo=gasto
   - Cargar tipos de pago: GET /tipos-pago
   - Usuario llena formulario
   - POST /gastos
   - Actualizar lista de gastos

5. **Token expira**
   - Interceptor detecta 401
   - POST /auth/refresh-token con refreshToken
   - Guardar nuevo accessToken
   - Reintentar request original

---

## 🚀 ¡Listo para Comenzar!

Con esta guía, puedes pedirme que implemente cualquier endpoint específico y te daré:
- ✅ Código completo en Dart/Flutter
- ✅ Modelos de datos
- ✅ Lógica de red con Dio
- ✅ Manejo de estados
- ✅ Ejemplos de UI

### Formato de Petición:

> "Implementa el endpoint de **[NOMBRE DEL ENDPOINT]** usando **[State Management]** (Riverpod/Provider/GetX/BLoC)"

**Ejemplo:**
> "Implementa el endpoint de Listar Ingresos con filtros usando Riverpod"

---

## 📞 Contacto del Backend

- **URL Base**: https://finsight-back.onrender.com/api/v1
- **Documentación**: https://finsight-back.onrender.com/api-docs
- **Health Check**: https://finsight-back.onrender.com/health

---

**¡Con esta información completa, cualquier asistente de IA podrá ayudarte a implementar perfectamente cada endpoint en tu app Flutter!** 🎉

