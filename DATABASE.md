# 📊 Documentación de Base de Datos - MIDAS

## Esquema de Base de Datos

MIDAS utiliza PostgreSQL con Prisma ORM. A continuación se describe el esquema completo.

## 📋 Tablas Principales

### 👤 usuarios

Tabla principal de usuarios del sistema.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del usuario | PK, AUTO_INCREMENT |
| email | VARCHAR(255) | Email del usuario | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | Contraseña hasheada (bcrypt) | NOT NULL |
| nombre | VARCHAR(100) | Nombre del usuario | NOT NULL |
| apellido | VARCHAR(100) | Apellido del usuario | NOT NULL |
| fecha_nacimiento | DATE | Fecha de nacimiento | NULL |
| telefono | VARCHAR(20) | Teléfono de contacto | NULL |
| moneda | VARCHAR(3) | Código de moneda (ISO 4217) | DEFAULT 'COP' |
| zona_horaria | VARCHAR(50) | Zona horaria | DEFAULT 'America/Bogota' |
| idioma | VARCHAR(5) | Idioma preferido | DEFAULT 'es' |
| notificaciones_email | BOOLEAN | Preferencia de notificaciones por email | DEFAULT true |
| notificaciones_push | BOOLEAN | Preferencia de notificaciones push | DEFAULT true |
| activo | BOOLEAN | Estado de la cuenta | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

### 📁 categorias

Categorías unificadas para ingresos y gastos.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único de la categoría | PK |
| nombre | VARCHAR(100) | Nombre de la categoría | NOT NULL |
| tipo | VARCHAR(10) | Tipo: 'ingreso' o 'gasto' | NOT NULL |
| icono | VARCHAR(50) | Emoji o nombre del icono | NULL |
| color | VARCHAR(7) | Color en formato HEX | NULL |
| descripcion | TEXT | Descripción de la categoría | NULL |
| activo | BOOLEAN | Estado de la categoría | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Categorías de Ingresos**: Salario, Freelance, Bonos, Inversiones, Ventas, Alquileres, Otros

**Categorías de Gastos**: Alimentación, Transporte, Vivienda, Servicios Públicos, Entretenimiento, Salud, Educación, Ropa, Restaurantes, Compras, Deudas, Ahorros, Mascotas, Regalos, Viajes, Gimnasio, Suscripciones, Seguros, Impuestos, Otros

### 💳 tipos_pago

Métodos de pago disponibles.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del tipo de pago | PK |
| nombre | VARCHAR(50) | Nombre del tipo de pago | UNIQUE, NOT NULL |
| descripcion | TEXT | Descripción | NULL |
| activo | BOOLEAN | Estado | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Tipos**: Efectivo, Débito, Crédito, Transferencia, PayPal, Billetera Digital, Cheque, Criptomonedas

### 📅 frecuencias

Frecuencias de recurrencia para transacciones.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único de la frecuencia | PK |
| nombre | VARCHAR(50) | Nombre de la frecuencia | UNIQUE, NOT NULL |
| dias | INTEGER | Número de días | NULL |
| descripcion | TEXT | Descripción | NULL |
| activo | BOOLEAN | Estado | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Frecuencias**: Diario (1), Semanal (7), Quincenal (15), Mensual (30), Bimestral (60), Trimestral (90), Semestral (180), Anual (365)

### 💰 ingresos

Registro de ingresos de los usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del ingreso | PK |
| usuario_id | INTEGER | ID del usuario propietario | FK → usuarios.id, NOT NULL |
| categoria_id | INTEGER | ID de la categoría | FK → categorias.id, NOT NULL |
| monto | DECIMAL(15,2) | Monto del ingreso | NOT NULL |
| descripcion | TEXT | Descripción del ingreso | NULL |
| fecha | DATE | Fecha del ingreso | NOT NULL |
| tipo_pago_id | INTEGER | ID del tipo de pago | FK → tipos_pago.id, NULL |
| es_recurrente | BOOLEAN | Si es recurrente | DEFAULT false |
| frecuencia_id | INTEGER | ID de frecuencia (si es recurrente) | FK → frecuencias.id, NULL |
| fecha_inicio | DATE | Fecha de inicio (si es recurrente) | NULL |
| fecha_fin | DATE | Fecha de fin (si es recurrente) | NULL |
| activo | BOOLEAN | Estado del registro | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índices**: usuario_id, categoria_id, fecha

### 💸 gastos

Registro de gastos de los usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del gasto | PK |
| usuario_id | INTEGER | ID del usuario propietario | FK → usuarios.id, NOT NULL |
| categoria_id | INTEGER | ID de la categoría | FK → categorias.id, NOT NULL |
| monto | DECIMAL(15,2) | Monto del gasto | NOT NULL |
| descripcion | TEXT | Descripción del gasto | NULL |
| fecha | DATE | Fecha del gasto | NOT NULL |
| tipo_pago_id | INTEGER | ID del tipo de pago | FK → tipos_pago.id, NULL |
| es_recurrente | BOOLEAN | Si es recurrente | DEFAULT false |
| frecuencia_id | INTEGER | ID de frecuencia (si es recurrente) | FK → frecuencias.id, NULL |
| fecha_inicio | DATE | Fecha de inicio (si es recurrente) | NULL |
| fecha_fin | DATE | Fecha de fin (si es recurrente) | NULL |
| activo | BOOLEAN | Estado del registro | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índices**: usuario_id, categoria_id, fecha

### 🎯 metas_ahorros

Metas de ahorro de los usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único de la meta | PK |
| usuario_id | INTEGER | ID del usuario propietario | FK → usuarios.id, NOT NULL |
| nombre | VARCHAR(200) | Nombre de la meta | NOT NULL |
| descripcion | TEXT | Descripción de la meta | NULL |
| monto_objetivo | DECIMAL(15,2) | Monto que se desea ahorrar | NOT NULL |
| monto_actual | DECIMAL(15,2) | Monto ahorrado actualmente | DEFAULT 0 |
| fecha_inicio | DATE | Fecha de inicio de la meta | NOT NULL |
| fecha_objetivo | DATE | Fecha objetivo para completar | NULL |
| estado | VARCHAR(20) | Estado: 'en_progreso', 'completada', 'cancelada' | DEFAULT 'en_progreso' |
| prioridad | VARCHAR(10) | Prioridad: 'baja', 'media', 'alta' | NULL |
| icono | VARCHAR(50) | Icono de la meta | NULL |
| activo | BOOLEAN | Estado del registro | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índice**: usuario_id

### 💵 ahorros

Movimientos (depósitos/retiros) en metas de ahorro.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del movimiento | PK |
| meta_id | INTEGER | ID de la meta de ahorro | FK → metas_ahorros.id, NOT NULL |
| tipo_movimiento | VARCHAR(10) | Tipo: 'deposito' o 'retiro' | NOT NULL |
| monto | DECIMAL(15,2) | Monto del movimiento | NOT NULL |
| descripcion | TEXT | Descripción del movimiento | NULL |
| fecha | TIMESTAMP | Fecha del movimiento | DEFAULT NOW() |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |

**Índice**: meta_id

### 📊 presupuestos

Presupuestos mensuales de los usuarios.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del presupuesto | PK |
| usuario_id | INTEGER | ID del usuario propietario | FK → usuarios.id, NOT NULL |
| nombre | VARCHAR(200) | Nombre del presupuesto | NOT NULL |
| mes | INTEGER | Mes (1-12) | NOT NULL |
| anio | INTEGER | Año | NOT NULL |
| monto_total | DECIMAL(15,2) | Monto total del presupuesto | NOT NULL |
| descripcion | TEXT | Descripción | NULL |
| activo | BOOLEAN | Estado del registro | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índice**: usuario_id
**Unique**: (usuario_id, mes, anio)

### 📈 presupuesto_categorias

Asignación de montos por categoría en presupuestos.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único | PK |
| presupuesto_id | INTEGER | ID del presupuesto | FK → presupuestos.id, NOT NULL |
| categoria_id | INTEGER | ID de la categoría | FK → categorias.id, NOT NULL |
| monto_asignado | DECIMAL(15,2) | Monto asignado a la categoría | NOT NULL |
| monto_gastado | DECIMAL(15,2) | Monto gastado en la categoría | DEFAULT 0 |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índice**: presupuesto_id
**Unique**: (presupuesto_id, categoria_id)

### 🔔 recordatorios

Sistema de recordatorios y notificaciones.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | SERIAL | ID único del recordatorio | PK |
| usuario_id | INTEGER | ID del usuario | FK → usuarios.id, NOT NULL |
| titulo | VARCHAR(200) | Título del recordatorio | NOT NULL |
| descripcion | TEXT | Descripción | NULL |
| fecha | TIMESTAMP | Fecha y hora del recordatorio | NOT NULL |
| tipo | VARCHAR(50) | Tipo: 'pago', 'meta', 'presupuesto', 'personalizado' | NOT NULL |
| completado | BOOLEAN | Si fue completado | DEFAULT false |
| activo | BOOLEAN | Estado del registro | DEFAULT true |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT NOW() |
| updated_at | TIMESTAMP | Fecha de actualización | AUTO UPDATE |

**Índices**: usuario_id, fecha

## 📈 Tablas Avanzadas (Fase 2)

### 📊 estadisticas

Estadísticas pre-calculadas para análisis rápido.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| usuario_id | INTEGER | ID del usuario |
| tipo | VARCHAR(50) | Tipo de estadística |
| periodo | VARCHAR(20) | Período (YYYY-MM o YYYY) |
| datos | JSONB | Datos en formato JSON |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 🤖 predicciones

Predicciones financieras generadas por IA.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| usuario_id | INTEGER | ID del usuario |
| tipo | VARCHAR(50) | Tipo: 'ingreso', 'gasto', 'balance' |
| periodo_inicio | DATE | Inicio del período predicho |
| periodo_fin | DATE | Fin del período predicho |
| valor_predicho | DECIMAL(15,2) | Valor predicho |
| valor_real | DECIMAL(15,2) | Valor real (para comparación) |
| precision | DECIMAL(5,2) | Precisión del modelo |
| metricas_modelo | JSONB | Métricas del modelo |
| modelo_usado | VARCHAR(100) | Nombre del modelo |
| confianza | DECIMAL(5,2) | Nivel de confianza |
| created_at | TIMESTAMP | Fecha de creación |

### 📄 reportes

Reportes generados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| usuario_id | INTEGER | ID del usuario |
| nombre | VARCHAR(200) | Nombre del reporte |
| tipo | VARCHAR(50) | Tipo de reporte |
| formato | VARCHAR(10) | Formato: 'pdf', 'excel', 'csv' |
| periodo_inicio | DATE | Inicio del período |
| periodo_fin | DATE | Fin del período |
| ruta_archivo | VARCHAR(500) | Ruta del archivo generado |
| parametros | JSONB | Parámetros de generación |
| generado_en | TIMESTAMP | Fecha de generación |

### 📋 plantillas_reportes

Plantillas configurables para reportes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| usuario_id | INTEGER | ID del usuario |
| nombre | VARCHAR(200) | Nombre de la plantilla |
| descripcion | TEXT | Descripción |
| tipo | VARCHAR(50) | Tipo de reporte |
| configuracion | JSONB | Configuración de la plantilla |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

## 🔄 Relaciones

```
usuarios
  ├── 1:N → ingresos
  ├── 1:N → gastos
  ├── 1:N → metas_ahorros
  │   └── 1:N → ahorros
  ├── 1:N → presupuestos
  │   └── 1:N → presupuesto_categorias
  ├── 1:N → recordatorios
  ├── 1:N → estadisticas
  ├── 1:N → predicciones
  ├── 1:N → reportes
  └── 1:N → plantillas_reportes

categorias
  ├── 1:N → ingresos
  ├── 1:N → gastos
  └── 1:N → presupuesto_categorias

tipos_pago
  ├── 1:N → ingresos
  └── 1:N → gastos

frecuencias
  ├── 1:N → ingresos
  └── 1:N → gastos
```

## 🔐 Políticas de Seguridad

1. **Soft Delete**: Las tablas principales usan `activo` en lugar de eliminar registros
2. **Cascade Delete**: Al eliminar un usuario, se eliminan todos sus datos relacionados
3. **Índices**: Optimización en campos de búsqueda frecuente
4. **Validaciones**: A nivel de aplicación con Prisma y Express Validator
5. **Transacciones**: Operaciones críticas usan transacciones de Prisma

## 📝 Comandos Útiles de Prisma

```bash
# Ver base de datos
npm run prisma:studio

# Generar migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset

# Formato del schema
npx prisma format
```

## 🔍 Consultas SQL Útiles

### Ver resumen de un usuario

```sql
SELECT 
  u.nombre,
  u.apellido,
  COUNT(DISTINCT i.id) as total_ingresos,
  COUNT(DISTINCT g.id) as total_gastos,
  COUNT(DISTINCT m.id) as metas_activas
FROM usuarios u
LEFT JOIN ingresos i ON u.id = i.usuario_id AND i.activo = true
LEFT JOIN gastos g ON u.id = g.usuario_id AND g.activo = true
LEFT JOIN metas_ahorros m ON u.id = m.usuario_id AND m.activo = true
WHERE u.id = 1
GROUP BY u.id;
```

### Gastos por categoría del mes actual

```sql
SELECT 
  c.nombre as categoria,
  COUNT(*) as cantidad,
  SUM(g.monto) as total
FROM gastos g
JOIN categorias c ON g.categoria_id = c.id
WHERE g.usuario_id = 1
  AND g.activo = true
  AND EXTRACT(MONTH FROM g.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM g.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY c.nombre
ORDER BY total DESC;
```

---

**Última actualización**: Enero 2024

