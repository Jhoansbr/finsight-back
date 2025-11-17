# 📮 Guía de Postman - MIDAS API

Esta guía te muestra cómo probar el backend de MIDAS usando Postman.

## 📥 Importar Colección a Postman

### Opción 1: Importar desde Swagger (Automático)

1. Asegúrate de que tu servidor esté corriendo: `npm run dev`
2. Abre Postman
3. Click en **"Import"** (arriba a la izquierda)
4. Selecciona **"Link"**
5. Pega esta URL:
```
http://localhost:3000/api-docs-json
```
6. Click **"Continue"** y luego **"Import"**

¡Listo! Tendrás todos los endpoints importados automáticamente.

### Opción 2: Crear Manualmente

Si prefieres crear la colección paso a paso:

## 🔧 Configuración Inicial de Postman

### 1. Crear una Colección

1. Click en **"Collections"** en el panel izquierdo
2. Click en **"+"** o **"Create Collection"**
3. Nómbrala: **"MIDAS API"**

### 2. Configurar Variables de Entorno

1. Click en **"Environments"** en el panel izquierdo
2. Click en **"+"** para crear un nuevo environment
3. Nómbralo: **"MIDAS Local"**
4. Agrega estas variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000/api/v1` | `http://localhost:3000/api/v1` |
| `access_token` | | (se llenará automáticamente) |

5. Click **"Save"**
6. Selecciona el environment **"MIDAS Local"** en el dropdown (arriba a la derecha)

## 🚀 Requests Principales

### 1️⃣ Health Check

**GET** `{{base_url}}/../health`

```
GET http://localhost:3000/health
```

No requiere autenticación. Sirve para verificar que el servidor funciona.

---

### 2️⃣ Registrar Usuario

**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "usuario@test.com",
  "password": "Test1234",
  "nombre": "Usuario",
  "apellido": "Prueba",
  "telefono": "3001234567"
}
```

**Tests (para guardar el token automáticamente):**

En la pestaña **"Tests"** del request, pega esto:

```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.accessToken);
    console.log("Token guardado:", jsonData.data.accessToken);
}
```

---

### 3️⃣ Login

**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "usuario@test.com",
  "password": "Test1234"
}
```

**Tests (para guardar el token):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.accessToken);
    console.log("Token guardado:", jsonData.data.accessToken);
}
```

---

### 4️⃣ Obtener Perfil (Autenticado)

**GET** `{{base_url}}/auth/me`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

---

### 5️⃣ Listar Categorías (Público)

**GET** `{{base_url}}/categorias`

No requiere autenticación.

**Query Params (opcional):**
- `tipo`: `ingreso` o `gasto`

---

### 6️⃣ Crear Ingreso

**POST** `{{base_url}}/ingresos`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "categoriaId": 1,
  "monto": 5000000,
  "descripcion": "Salario de Enero",
  "fecha": "2024-01-31",
  "tipoPagoId": 4
}
```

---

### 7️⃣ Listar Ingresos

**GET** `{{base_url}}/ingresos`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Query Params (opcional):**
- `page`: `1`
- `limit`: `20`
- `fechaInicio`: `2024-01-01`
- `fechaFin`: `2024-01-31`
- `categoriaId`: `1`

---

### 8️⃣ Crear Gasto

**POST** `{{base_url}}/gastos`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "categoriaId": 8,
  "monto": 350000,
  "descripcion": "Mercado del mes",
  "fecha": "2024-01-15",
  "tipoPagoId": 1
}
```

---

### 9️⃣ Listar Gastos

**GET** `{{base_url}}/gastos`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Query Params (opcional):**
- `page`: `1`
- `limit`: `20`
- `fechaInicio`: `2024-01-01`
- `fechaFin`: `2024-01-31`

---

### 🔟 Dashboard - Resumen General

**GET** `{{base_url}}/dashboard/resumen`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

---

### 1️⃣1️⃣ Crear Meta de Ahorro

**POST** `{{base_url}}/metas-ahorros`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Vacaciones 2024",
  "montoObjetivo": 5000000,
  "fechaInicio": "2024-01-01",
  "fechaObjetivo": "2024-12-01",
  "prioridad": "alta",
  "descripcion": "Viaje a Cartagena"
}
```

---

### 1️⃣2️⃣ Agregar Depósito a Meta

**POST** `{{base_url}}/metas-ahorros/1/movimientos`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "tipoMovimiento": "deposito",
  "monto": 500000,
  "descripcion": "Ahorro de enero"
}
```

---

### 1️⃣3️⃣ Crear Presupuesto

**POST** `{{base_url}}/presupuestos`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Presupuesto Enero 2024",
  "mes": 1,
  "anio": 2024,
  "montoTotal": 3000000,
  "descripcion": "Presupuesto mensual"
}
```

---

### 1️⃣4️⃣ Asignar Categoría al Presupuesto

**POST** `{{base_url}}/presupuestos/1/categorias`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "categoriaId": 8,
  "montoAsignado": 800000
}
```

---

### 1️⃣5️⃣ Ver Progreso del Presupuesto

**GET** `{{base_url}}/presupuestos/1/progreso`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

---

## 🎯 Flujo de Prueba Completo

### Paso 1: Autenticación
1. ✅ `POST /auth/register` - Registrar usuario (o usa login si ya existe)
2. ✅ El token se guarda automáticamente en `{{access_token}}`

### Paso 2: Ver Datos Base
3. ✅ `GET /categorias` - Ver las 27 categorías disponibles
4. ✅ `GET /tipos-pago` - Ver los 8 tipos de pago
5. ✅ `GET /frecuencias` - Ver las frecuencias

### Paso 3: Crear Transacciones
6. ✅ `POST /ingresos` - Crear varios ingresos
7. ✅ `POST /gastos` - Crear varios gastos

### Paso 4: Dashboard
8. ✅ `GET /dashboard/resumen` - Ver tu resumen financiero

### Paso 5: Metas y Presupuestos
9. ✅ `POST /metas-ahorros` - Crear meta
10. ✅ `POST /metas-ahorros/1/movimientos` - Agregar ahorro
11. ✅ `POST /presupuestos` - Crear presupuesto
12. ✅ `POST /presupuestos/1/categorias` - Asignar categorías

## 📦 Exportar Colección

Para compartir tu colección:

1. Click derecho en la colección **"MIDAS API"**
2. Click en **"Export"**
3. Selecciona **"Collection v2.1"**
4. Click **"Export"**
5. Guarda el archivo JSON

## 📥 Importar Colección Existente

Si alguien te comparte una colección:

1. Click en **"Import"**
2. Arrastra el archivo JSON o selecciónalo
3. Click **"Import"**

## 💡 Tips de Postman

### 1. Scripts de Pre-request

Para hacer algo antes de cada request (opcional):

```javascript
// Pre-request Script
console.log("Ejecutando request a:", pm.request.url);
```

### 2. Tests Automáticos

Para verificar respuestas automáticamente:

```javascript
// Tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});
```

### 3. Colección Runner

Para ejecutar múltiples requests automáticamente:

1. Click en **"Runner"** (arriba)
2. Selecciona tu colección
3. Click **"Run MIDAS API"**

### 4. Variables Dinámicas

Postman tiene variables útiles:

- `{{$timestamp}}` - Timestamp actual
- `{{$randomInt}}` - Número random
- `{{$guid}}` - GUID único

Ejemplo:
```json
{
  "email": "user{{$timestamp}}@test.com",
  "password": "Test1234"
}
```

## 🌐 Environments para Producción

Cuando publiques en Render, crea un nuevo environment:

**Name:** "MIDAS Production"

| Variable | Value |
|----------|-------|
| `base_url` | `https://tu-app.onrender.com/api/v1` |
| `access_token` | (se llenará automáticamente) |

Luego solo cambias entre environments según necesites.

## ⚡ Atajos de Teclado

- `Ctrl + Enter` - Enviar request
- `Ctrl + S` - Guardar request
- `Ctrl + B` - Mostrar/ocultar sidebar
- `Ctrl + E` - Cambiar environment

---

**¡Listo para probar con Postman! 🚀**

