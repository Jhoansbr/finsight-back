# 📱 Documentación de Endpoints - MIDAS API

## 🌐 URL Base

```
https://finsight-back.onrender.com/api/v1
```

---

## 📋 Índice de Endpoints

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Datos Maestros](#datos-maestros)
4. [Ingresos](#ingresos)
5. [Gastos](#gastos)
6. [Metas de Ahorro](#metas-de-ahorro)
7. [Presupuestos](#presupuestos)
8. [Dashboard](#dashboard)
9. [Recordatorios](#recordatorios)

---

# 🔐 Autenticación

## 1. Registrar Usuario

**Endpoint:** `POST /auth/register`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3001234567",
  "fechaNacimiento": "1990-01-15"
}
```

**Campos Requeridos:**
- ✅ `email` (string, email válido)
- ✅ `password` (string, mínimo 8 caracteres, debe contener mayúscula, minúscula y número)
- ✅ `nombre` (string, máximo 100 caracteres)
- ✅ `apellido` (string, máximo 100 caracteres)

**Campos Opcionales:**
- `telefono` (string)
- `fechaNacimiento` (string, formato ISO: YYYY-MM-DD)

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "telefono": "3001234567",
      "moneda": "COP",
      "zonaHoraria": "America/Bogota",
      "idioma": "es",
      "createdAt": "2024-01-20T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Ejemplo Flutter:**
```dart
final response = await dio.post(
  '/auth/register',
  data: {
    'email': 'usuario@example.com',
    'password': 'Password123',
    'nombre': 'Juan',
    'apellido': 'Pérez',
  },
);
```

---

## 2. Iniciar Sesión

**Endpoint:** `POST /auth/login`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Ejemplo Flutter:**
```dart
final response = await dio.post(
  '/auth/login',
  data: {
    'email': email,
    'password': password,
  },
);
final token = response.data['data']['accessToken'];
await storage.write(key: 'access_token', value: token);
```

---

## 3. Obtener Perfil

**Endpoint:** `GET /auth/me`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "fechaNacimiento": "1990-01-15",
    "telefono": "3001234567",
    "moneda": "COP",
    "zonaHoraria": "America/Bogota",
    "idioma": "es",
    "notificacionesEmail": true,
    "notificacionesPush": true,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

## 4. Refrescar Token

**Endpoint:** `POST /auth/refresh-token`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/auth/refresh-token
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 5. Cerrar Sesión

**Endpoint:** `POST /auth/logout`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

---

# 👤 Usuarios

## 6. Actualizar Perfil

**Endpoint:** `PUT /users/profile`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/users/profile
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "3009876543",
  "fechaNacimiento": "1990-01-15"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "telefono": "3009876543",
    "fechaNacimiento": "1990-01-15",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

## 7. Actualizar Preferencias

**Endpoint:** `PUT /users/preferences`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/users/preferences
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "moneda": "USD",
  "zonaHoraria": "America/New_York",
  "idioma": "en",
  "notificacionesEmail": false,
  "notificacionesPush": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "moneda": "USD",
    "zonaHoraria": "America/New_York",
    "idioma": "en",
    "notificacionesEmail": false,
    "notificacionesPush": true,
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

## 8. Cambiar Contraseña

**Endpoint:** `PUT /users/change-password`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/users/change-password
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "message": "Contraseña actualizada exitosamente"
  }
}
```

---

# 📊 Datos Maestros

## 9. Listar Categorías

**Endpoint:** `GET /categorias`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/categorias
```

**Query Params (Opcionales):**
- `tipo`: `ingreso` o `gasto`

**Ejemplo con filtro:**
```
https://finsight-back.onrender.com/api/v1/categorias?tipo=gasto
```

**Headers:** Ninguno (Endpoint público)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Salario",
      "tipo": "ingreso",
      "icono": "💰",
      "color": "#4CAF50",
      "descripcion": "Salario mensual",
      "activo": true
    },
    {
      "id": 8,
      "nombre": "Alimentación",
      "tipo": "gasto",
      "icono": "🍔",
      "color": "#FF5252",
      "descripcion": "Supermercado y comidas",
      "activo": true
    }
  ]
}
```

---

## 10. Listar Tipos de Pago

**Endpoint:** `GET /tipos-pago`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/tipos-pago
```

**Headers:** Ninguno (Endpoint público)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Efectivo",
      "descripcion": "Pago en efectivo"
    },
    {
      "id": 2,
      "nombre": "Débito",
      "descripcion": "Tarjeta de débito"
    },
    {
      "id": 3,
      "nombre": "Crédito",
      "descripcion": "Tarjeta de crédito"
    },
    {
      "id": 4,
      "nombre": "Transferencia",
      "descripcion": "Transferencia bancaria"
    }
  ]
}
```

---

## 11. Listar Frecuencias

**Endpoint:** `GET /frecuencias`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/frecuencias
```

**Headers:** Ninguno (Endpoint público)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Diario",
      "dias": 1,
      "descripcion": "Se repite cada día"
    },
    {
      "id": 2,
      "nombre": "Semanal",
      "dias": 7,
      "descripcion": "Se repite cada semana"
    },
    {
      "id": 4,
      "nombre": "Mensual",
      "dias": 30,
      "descripcion": "Se repite cada mes"
    }
  ]
}
```

---

# 💰 Ingresos

## 12. Crear Ingreso

**Endpoint:** `POST /ingresos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/ingresos
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "categoriaId": 1,
  "monto": 5000000,
  "descripcion": "Salario de Enero",
  "fecha": "2024-01-31",
  "tipoPagoId": 4,
  "esRecurrente": false
}
```

**Body (Ingreso Recurrente):**
```json
{
  "categoriaId": 1,
  "monto": 5000000,
  "descripcion": "Salario mensual",
  "fecha": "2024-01-31",
  "tipoPagoId": 4,
  "esRecurrente": true,
  "frecuenciaId": 4,
  "fechaInicio": "2024-01-31",
  "fechaFin": "2024-12-31"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "categoriaId": 1,
    "monto": "5000000.00",
    "descripcion": "Salario de Enero",
    "fecha": "2024-01-31",
    "tipoPagoId": 4,
    "esRecurrente": false,
    "activo": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "categoria": {
      "id": 1,
      "nombre": "Salario",
      "icono": "💰",
      "color": "#4CAF50"
    },
    "tipoPago": {
      "id": 4,
      "nombre": "Transferencia"
    }
  }
}
```

---

## 13. Listar Ingresos

**Endpoint:** `GET /ingresos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/ingresos
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params (Opcionales):**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `fechaInicio` (formato: YYYY-MM-DD)
- `fechaFin` (formato: YYYY-MM-DD)
- `categoriaId` (número)
- `esRecurrente` (true/false)

**Ejemplo con filtros:**
```
https://finsight-back.onrender.com/api/v1/ingresos?page=1&limit=20&fechaInicio=2024-01-01&fechaFin=2024-01-31&categoriaId=1
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "monto": "5000000.00",
      "descripcion": "Salario de Enero",
      "fecha": "2024-01-31",
      "categoria": {
        "nombre": "Salario",
        "icono": "💰",
        "color": "#4CAF50"
      },
      "tipoPago": {
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

---

## 14. Obtener Ingreso por ID

**Endpoint:** `GET /ingresos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/ingresos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "categoriaId": 1,
    "monto": "5000000.00",
    "descripcion": "Salario de Enero",
    "fecha": "2024-01-31",
    "tipoPagoId": 4,
    "esRecurrente": false,
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
}
```

---

## 15. Actualizar Ingreso

**Endpoint:** `PUT /ingresos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/ingresos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "monto": 5500000,
  "descripcion": "Salario de Enero + Bono"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "monto": "5500000.00",
    "descripcion": "Salario de Enero + Bono",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

## 16. Eliminar Ingreso

**Endpoint:** `DELETE /ingresos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/ingresos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "message": "Ingreso eliminado exitosamente"
  }
}
```

---

# 💸 Gastos

## 17. Crear Gasto

**Endpoint:** `POST /gastos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/gastos
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "categoriaId": 8,
  "monto": 350000,
  "descripcion": "Mercado del mes",
  "fecha": "2024-01-15",
  "tipoPagoId": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "categoriaId": 8,
    "monto": "350000.00",
    "descripcion": "Mercado del mes",
    "fecha": "2024-01-15",
    "tipoPagoId": 1,
    "categoria": {
      "nombre": "Alimentación",
      "icono": "🍔",
      "color": "#FF5252"
    },
    "tipoPago": {
      "nombre": "Efectivo"
    }
  }
}
```

---

## 18. Listar Gastos

**Endpoint:** `GET /gastos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/gastos
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:** Iguales que ingresos

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "monto": "350000.00",
      "descripcion": "Mercado del mes",
      "fecha": "2024-01-15",
      "categoria": {
        "nombre": "Alimentación",
        "icono": "🍔",
        "color": "#FF5252"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10
  }
}
```

---

## 19. Obtener Gasto por ID

**Endpoint:** `GET /gastos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/gastos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 20. Actualizar Gasto

**Endpoint:** `PUT /gastos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/gastos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 21. Eliminar Gasto

**Endpoint:** `DELETE /gastos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/gastos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

# 🎯 Metas de Ahorro

## 22. Crear Meta de Ahorro

**Endpoint:** `POST /metas-ahorros`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Vacaciones 2024",
  "descripcion": "Viaje a Cartagena",
  "montoObjetivo": 5000000,
  "fechaInicio": "2024-01-01",
  "fechaObjetivo": "2024-12-01",
  "prioridad": "alta",
  "icono": "✈️"
}
```

**Campos:**
- `prioridad`: `baja`, `media`, `alta`
- `estado`: `en_progreso` (default), `completada`, `cancelada`

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "nombre": "Vacaciones 2024",
    "descripcion": "Viaje a Cartagena",
    "montoObjetivo": "5000000.00",
    "montoActual": "0.00",
    "fechaInicio": "2024-01-01",
    "fechaObjetivo": "2024-12-01",
    "estado": "en_progreso",
    "prioridad": "alta",
    "icono": "✈️",
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

## 23. Listar Metas de Ahorro

**Endpoint:** `GET /metas-ahorros`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params (Opcionales):**
- `page`
- `limit`
- `estado`: `en_progreso`, `completada`, `cancelada`
- `prioridad`: `baja`, `media`, `alta`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Vacaciones 2024",
      "montoObjetivo": "5000000.00",
      "montoActual": "1500000.00",
      "fechaObjetivo": "2024-12-01",
      "estado": "en_progreso",
      "prioridad": "alta",
      "icono": "✈️",
      "progreso": "30.00"
    }
  ]
}
```

---

## 24. Obtener Meta de Ahorro por ID

**Endpoint:** `GET /metas-ahorros/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Vacaciones 2024",
    "montoObjetivo": "5000000.00",
    "montoActual": "1500000.00",
    "progreso": "30.00",
    "ahorros": [
      {
        "id": 1,
        "tipoMovimiento": "deposito",
        "monto": "500000.00",
        "descripcion": "Ahorro de enero",
        "fecha": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 25. Actualizar Meta de Ahorro

**Endpoint:** `PUT /metas-ahorros/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros/1
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 26. Eliminar Meta de Ahorro

**Endpoint:** `DELETE /metas-ahorros/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 27. Agregar Movimiento a Meta (Depósito/Retiro)

**Endpoint:** `POST /metas-ahorros/{id}/movimientos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros/1/movimientos
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body (Depósito):**
```json
{
  "tipoMovimiento": "deposito",
  "monto": 500000,
  "descripcion": "Ahorro de enero",
  "fecha": "2024-01-15"
}
```

**Body (Retiro):**
```json
{
  "tipoMovimiento": "retiro",
  "monto": 200000,
  "descripcion": "Emergencia médica"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "metaId": 1,
    "tipoMovimiento": "deposito",
    "monto": "500000.00",
    "descripcion": "Ahorro de enero",
    "fecha": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## 28. Listar Movimientos de una Meta

**Endpoint:** `GET /metas-ahorros/{id}/movimientos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/metas-ahorros/1/movimientos
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:**
- `page`
- `limit`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipoMovimiento": "deposito",
      "monto": "500000.00",
      "descripcion": "Ahorro de enero",
      "fecha": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "tipoMovimiento": "retiro",
      "monto": "200000.00",
      "descripcion": "Emergencia",
      "fecha": "2024-01-20T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

---

# 📊 Presupuestos

## 29. Crear Presupuesto

**Endpoint:** `POST /presupuestos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Presupuesto Enero 2024",
  "mes": 1,
  "anio": 2024,
  "montoTotal": 3000000,
  "descripcion": "Presupuesto mensual",
  "categorias": [
    {
      "categoriaId": 8,
      "montoAsignado": 800000
    },
    {
      "categoriaId": 9,
      "montoAsignado": 500000
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "nombre": "Presupuesto Enero 2024",
    "mes": 1,
    "anio": 2024,
    "montoTotal": "3000000.00",
    "descripcion": "Presupuesto mensual",
    "activo": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "categorias": [
      {
        "id": 1,
        "presupuestoId": 1,
        "categoriaId": 8,
        "montoAsignado": "800000.00",
        "montoGastado": "0.00",
        "categoria": {
          "id": 8,
          "nombre": "Alimentación",
          "icono": "🍔",
          "color": "#FF5252"
        }
      },
      {
        "id": 2,
        "presupuestoId": 1,
        "categoriaId": 9,
        "montoAsignado": "500000.00",
        "montoGastado": "0.00",
        "categoria": {
          "id": 9,
          "nombre": "Transporte",
          "icono": "🚗",
          "color": "#448AFF"
        }
      }
    ]
  }
}
```

---

## 30. Listar Presupuestos

**Endpoint:** `GET /presupuestos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:**
- `page`
- `limit`
- `mes` (1-12)
- `anio` (2000-2100)

**Ejemplo:**
```
https://finsight-back.onrender.com/api/v1/presupuestos?mes=1&anio=2024
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Presupuesto Enero 2024",
      "mes": 1,
      "anio": 2024,
      "montoTotal": "3000000.00",
      "categorias": [
        {
          "categoriaId": 8,
          "categoria": {
            "nombre": "Alimentación",
            "icono": "🍔"
          },
          "montoAsignado": "800000.00",
          "montoGastado": "350000.00"
        }
      ]
    }
  ]
}
```

---

## 31. Obtener Presupuesto por ID

**Endpoint:** `GET /presupuestos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 32. Actualizar Presupuesto

**Endpoint:** `PUT /presupuestos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Presupuesto Enero 2024 - Actualizado",
  "montoTotal": 3500000,
  "descripcion": "Ajuste por inflación"
}
```

---

## 33. Eliminar Presupuesto

**Endpoint:** `DELETE /presupuestos/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 34. Asignar Categoría al Presupuesto

**Endpoint:** `POST /presupuestos/{id}/categorias`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos/1/categorias
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "categoriaId": 8,
  "montoAsignado": 800000
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "presupuestoId": 1,
    "categoriaId": 8,
    "montoAsignado": "800000.00",
    "montoGastado": "0.00",
    "categoria": {
      "nombre": "Alimentación",
      "icono": "🍔",
      "color": "#FF5252"
    }
  }
}
```

---

## 35. Ver Progreso del Presupuesto

**Endpoint:** `GET /presupuestos/{id}/progreso`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/presupuestos/1/progreso
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "presupuesto": {
      "id": 1,
      "nombre": "Presupuesto Enero 2024",
      "mes": 1,
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
        "categoriaId": 8,
        "categoriaNombre": "Alimentación",
        "categoriaColor": "#FF5252",
        "categoriaIcono": "🍔",
        "montoAsignado": 800000,
        "montoGastado": 350000,
        "restante": 450000,
        "porcentajeUsado": 43.75,
        "excedido": false
      },
      {
        "categoriaId": 9,
        "categoriaNombre": "Transporte",
        "categoriaColor": "#448AFF",
        "categoriaIcono": "🚗",
        "montoAsignado": 500000,
        "montoGastado": 600000,
        "restante": -100000,
        "porcentajeUsado": 120.00,
        "excedido": true
      }
    ]
  }
}
```

---

# 📈 Dashboard

## 36. Resumen General

**Endpoint:** `GET /dashboard/resumen`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/dashboard/resumen
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "mesActual": {
      "mes": 1,
      "anio": 2024,
      "totalIngresos": 5000000,
      "totalGastos": 2500000,
      "balance": 2500000
    },
    "metasAhorro": {
      "activas": 2,
      "metas": [
        {
          "id": 1,
          "nombre": "Vacaciones 2024",
          "montoObjetivo": 5000000,
          "montoActual": 1500000,
          "progreso": "30.00"
        }
      ]
    },
    "recordatoriosPendientes": 3
  }
}
```

---

## 37. Resumen Mensual

**Endpoint:** `GET /dashboard/mensual/{mes}/{anio}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/dashboard/mensual/1/2024
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "mes": 1,
      "anio": 2024
    },
    "resumen": {
      "totalIngresos": 5000000,
      "cantidadIngresos": 2,
      "totalGastos": 2500000,
      "cantidadGastos": 15,
      "balance": 2500000,
      "tasaAhorro": "50.00"
    },
    "gastosPorCategoria": [
      {
        "categoriaId": 8,
        "categoriaNombre": "Alimentación",
        "categoriaColor": "#FF5252",
        "categoriaIcono": "🍔",
        "total": 800000
      },
      {
        "categoriaId": 9,
        "categoriaNombre": "Transporte",
        "categoriaColor": "#448AFF",
        "categoriaIcono": "🚗",
        "total": 500000
      }
    ]
  }
}
```

---

## 38. Tendencias (Últimos 6 meses)

**Endpoint:** `GET /estadisticas/tendencias`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/estadisticas/tendencias
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "mes": 8,
      "anio": 2023,
      "periodo": "2023-08",
      "ingresos": 4500000,
      "gastos": 3000000,
      "balance": 1500000
    },
    {
      "mes": 9,
      "anio": 2023,
      "periodo": "2023-09",
      "ingresos": 5000000,
      "gastos": 2800000,
      "balance": 2200000
    }
  ]
}
```

---

## 39. Balance Histórico

**Endpoint:** `GET /estadisticas/balance-historico`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/estadisticas/balance-historico
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:**
- `meses` (default: 12)

**Ejemplo:**
```
https://finsight-back.onrender.com/api/v1/estadisticas/balance-historico?meses=6
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "mes": 1,
      "anio": 2024,
      "periodo": "2024-01",
      "ingresos": 5000000,
      "gastos": 2500000,
      "balance": 2500000,
      "tasaAhorro": "50.00"
    }
  ]
}
```

---

## 40. Gastos por Categoría

**Endpoint:** `GET /estadisticas/gastos-categoria`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/estadisticas/gastos-categoria
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params (Requeridos):**
- `fechaInicio` (YYYY-MM-DD)
- `fechaFin` (YYYY-MM-DD)

**Ejemplo:**
```
https://finsight-back.onrender.com/api/v1/estadisticas/gastos-categoria?fechaInicio=2024-01-01&fechaFin=2024-01-31
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "totalGastos": 2500000,
    "categorias": [
      {
        "categoriaId": 8,
        "categoriaNombre": "Alimentación",
        "categoriaColor": "#FF5252",
        "categoriaIcono": "🍔",
        "total": 800000,
        "cantidad": 10,
        "porcentaje": 32.00
      },
      {
        "categoriaId": 9,
        "categoriaNombre": "Transporte",
        "categoriaColor": "#448AFF",
        "categoriaIcono": "🚗",
        "total": 500000,
        "cantidad": 8,
        "porcentaje": 20.00
      }
    ]
  }
}
```

---

# 🔔 Recordatorios

## 41. Crear Recordatorio

**Endpoint:** `POST /recordatorios`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Pagar servicio de luz",
  "descripcion": "Pago del recibo de energía",
  "fecha": "2024-02-05T09:00:00.000Z",
  "tipo": "pago"
}
```

**Tipos disponibles:**
- `pago`
- `meta`
- `presupuesto`
- `personalizado`

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuarioId": 1,
    "titulo": "Pagar servicio de luz",
    "descripcion": "Pago del recibo de energía",
    "fecha": "2024-02-05T09:00:00.000Z",
    "tipo": "pago",
    "completado": false,
    "activo": true,
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

## 42. Listar Recordatorios

**Endpoint:** `GET /recordatorios`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Params:**
- `page`
- `limit`
- `completado` (true/false)
- `tipo` (pago, meta, presupuesto, personalizado)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pagar servicio de luz",
      "descripcion": "Pago del recibo de energía",
      "fecha": "2024-02-05T09:00:00.000Z",
      "tipo": "pago",
      "completado": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

## 43. Recordatorios Próximos (7 días)

**Endpoint:** `GET /recordatorios/proximos`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios/proximos
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pagar servicio de luz",
      "fecha": "2024-02-05T09:00:00.000Z",
      "tipo": "pago"
    }
  ]
}
```

---

## 44. Obtener Recordatorio por ID

**Endpoint:** `GET /recordatorios/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

## 45. Actualizar Recordatorio

**Endpoint:** `PUT /recordatorios/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios/1
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 46. Marcar Recordatorio como Completado

**Endpoint:** `PATCH /recordatorios/{id}/completar`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios/1/completar
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "completado": true,
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

## 47. Eliminar Recordatorio

**Endpoint:** `DELETE /recordatorios/{id}`

**URL Completa:**
```
https://finsight-back.onrender.com/api/v1/recordatorios/1
```

**Headers:**
```
Authorization: Bearer {access_token}
```

---

# ⚠️ Manejo de Errores

## Formato de Error Estándar

Todos los errores siguen este formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error",
    "details": {}
  }
}
```

## Códigos de Error Comunes

| Código HTTP | Error Code | Descripción |
|-------------|-----------|-------------|
| 400 | VALIDATION_ERROR | Datos de entrada inválidos |
| 401 | AUTHENTICATION_ERROR | No autenticado o token inválido |
| 401 | TOKEN_EXPIRED | Token expirado |
| 403 | AUTHORIZATION_ERROR | Sin permisos |
| 404 | NOT_FOUND | Recurso no encontrado |
| 409 | CONFLICT_ERROR | Conflicto (ej: email duplicado) |
| 429 | RATE_LIMIT_EXCEEDED | Demasiadas peticiones |
| 500 | INTERNAL_ERROR | Error del servidor |

## Ejemplos de Errores

**Error de Validación:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errores de validación",
    "details": {
      "email": ["Email inválido"],
      "password": ["La contraseña debe tener al menos 8 caracteres"]
    }
  }
}
```

**Error de Autenticación:**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Token no proporcionado",
    "details": {}
  }
}
```

**Error de Recurso No Encontrado:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Ingreso no encontrado",
    "details": {}
  }
}
```

---

# 🔒 Autenticación en Flutter

## Ejemplo Completo de Implementación

```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: 'https://finsight-back.onrender.com/api/v1',
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  )) {
    // Interceptor para agregar token automáticamente
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Si el token expiró, intentar refrescarlo
        if (error.response?.statusCode == 401) {
          final refreshToken = await _storage.read(key: 'refresh_token');
          if (refreshToken != null) {
            try {
              final response = await _dio.post('/auth/refresh-token', 
                data: {'refreshToken': refreshToken}
              );
              
              final newToken = response.data['data']['accessToken'];
              await _storage.write(key: 'access_token', value: newToken);
              
              // Reintentar petición original
              final options = error.requestOptions;
              options.headers['Authorization'] = 'Bearer $newToken';
              final retryResponse = await _dio.fetch(options);
              return handler.resolve(retryResponse);
            } catch (e) {
              // Si falla el refresh, cerrar sesión
              await _storage.deleteAll();
            }
          }
        }
        return handler.next(error);
      },
    ));
  }
  
  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    
    if (response.data['success']) {
      final data = response.data['data'];
      await _storage.write(key: 'access_token', value: data['accessToken']);
      await _storage.write(key: 'refresh_token', value: data['refreshToken']);
      return data;
    }
    throw Exception('Login failed');
  }
  
  // Obtener Dashboard
  Future<Map<String, dynamic>> getDashboard() async {
    final response = await _dio.get('/dashboard/resumen');
    return response.data['data'];
  }
  
  // Crear Gasto
  Future<Map<String, dynamic>> crearGasto({
    required int categoriaId,
    required double monto,
    required String fecha,
    String? descripcion,
    int? tipoPagoId,
  }) async {
    final response = await _dio.post('/gastos', data: {
      'categoriaId': categoriaId,
      'monto': monto,
      'fecha': fecha,
      if (descripcion != null) 'descripcion': descripcion,
      if (tipoPagoId != null) 'tipoPagoId': tipoPagoId,
    });
    return response.data['data'];
  }
}
```

---

# 📝 Notas Importantes

## Fechas
- Formato ISO 8601: `YYYY-MM-DD` para fechas
- Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ` para timestamps

## Decimales
- Montos siempre como números: `5000000` o `5000000.50`
- En respuestas vienen como strings: `"5000000.00"`

## Paginación
- `page`: Número de página (inicia en 1)
- `limit`: Registros por página (default: 20, max: 100)

## Soft Delete
- Al eliminar recursos, se marcan como `activo: false`
- No se eliminan físicamente de la BD

## Rate Limiting
- 100 peticiones cada 15 minutos (general)
- 5 intentos de autenticación cada 15 minutos

---

# 🎉 ¡Todo Listo!

Tienes **47 endpoints** disponibles para tu app móvil.

**URL Base:**
```
https://finsight-back.onrender.com/api/v1
```

**Documentación Interactiva:**
```
https://finsight-back.onrender.com/api-docs
```

¡Feliz desarrollo! 🚀📱

