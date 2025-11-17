# MIDAS - Sistema de Gestión Financiera Personal

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Backend API REST para MIDAS, un sistema completo de gestión financiera personal que permite controlar ingresos, gastos, ahorros, presupuestos y recibir predicciones financieras.

## 📋 Características

### Fase 1 (MVP) - ✅ Implementado
- ✅ **Autenticación JWT** completa con registro y login
- ✅ **Gestión de Usuarios** con perfil y preferencias
- ✅ **CRUD de Ingresos** con categorización y recurrencia
- ✅ **CRUD de Gastos** con categorización y recurrencia
- ✅ **Metas de Ahorro** con seguimiento de progreso y movimientos
- ✅ **Presupuestos** con asignación por categorías y tracking
- ✅ **Dashboard** con resumen financiero y estadísticas
- ✅ **Recordatorios** para pagos y eventos financieros
- ✅ **Documentación Swagger** automática

### Fase 2 - 🚧 En desarrollo
- 🚧 Sistema de predicciones con IA
- 🚧 Generación de reportes (PDF, Excel, CSV)
- 🚧 Plantillas de reportes personalizables

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Express Validator
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Seguridad**: Helmet, bcrypt, rate-limiting

## 📁 Estructura del Proyecto

```
finsight-back/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.js                # Datos iniciales
├── src/
│   ├── config/                # Configuraciones
│   │   ├── database.js        # Conexión a BD
│   │   ├── jwt.js             # Configuración JWT
│   │   ├── logger.js          # Logger Winston
│   │   └── swagger.js         # Config Swagger
│   ├── controllers/           # Controladores
│   ├── middleware/            # Middlewares
│   │   ├── auth.js            # Autenticación
│   │   ├── errorHandler.js    # Manejo de errores
│   │   ├── validation.js      # Validación
│   │   └── rateLimiter.js     # Rate limiting
│   ├── routes/                # Definición de rutas
│   ├── services/              # Lógica de negocio
│   ├── utils/                 # Utilidades
│   │   ├── errors.js          # Clases de errores
│   │   ├── response.js        # Formatos de respuesta
│   │   └── bcrypt.js          # Hash de contraseñas
│   ├── validators/            # Validadores
│   ├── app.js                 # Configuración Express
│   └── server.js              # Punto de entrada
├── tests/                     # Tests
├── logs/                      # Archivos de log
├── .env                       # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v13 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd finsight-back
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/midas_db?schema=public"

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambia_esto
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_clave_refresh_super_segura_cambia_esto
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Logs
LOG_LEVEL=info

# Configuración regional
DEFAULT_CURRENCY=COP
DEFAULT_TIMEZONE=America/Bogota
DEFAULT_LANGUAGE=es
```

4. **Configurar la base de datos**

Asegúrate de tener PostgreSQL corriendo y crea la base de datos:

```bash
createdb midas_db
```

5. **Generar el cliente de Prisma**
```bash
npm run prisma:generate
```

6. **Ejecutar migraciones (si es necesario)**
```bash
npm run prisma:migrate
```

7. **Cargar datos iniciales (seeds)**
```bash
npm run prisma:seed
```

Este comando cargará:
- 27 categorías (ingresos y gastos)
- 8 tipos de pago
- 8 frecuencias de recurrencia

8. **Iniciar el servidor**

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 Documentación API

Una vez que el servidor esté corriendo, accede a la documentación interactiva de Swagger:

```
http://localhost:3000/api-docs
```

## 🔑 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/refresh-token` - Refrescar token
- `GET /api/v1/auth/me` - Obtener perfil del usuario autenticado
- `POST /api/v1/auth/logout` - Cerrar sesión

### Usuarios
- `PUT /api/v1/users/profile` - Actualizar perfil
- `PUT /api/v1/users/preferences` - Actualizar preferencias
- `PUT /api/v1/users/change-password` - Cambiar contraseña

### Datos Base
- `GET /api/v1/categorias` - Listar categorías
- `GET /api/v1/tipos-pago` - Listar tipos de pago
- `GET /api/v1/frecuencias` - Listar frecuencias

### Ingresos
- `POST /api/v1/ingresos` - Crear ingreso
- `GET /api/v1/ingresos` - Listar ingresos (con filtros)
- `GET /api/v1/ingresos/:id` - Obtener ingreso específico
- `PUT /api/v1/ingresos/:id` - Actualizar ingreso
- `DELETE /api/v1/ingresos/:id` - Eliminar ingreso

### Gastos
- `POST /api/v1/gastos` - Crear gasto
- `GET /api/v1/gastos` - Listar gastos (con filtros)
- `GET /api/v1/gastos/:id` - Obtener gasto específico
- `PUT /api/v1/gastos/:id` - Actualizar gasto
- `DELETE /api/v1/gastos/:id` - Eliminar gasto

### Metas de Ahorro
- `POST /api/v1/metas-ahorros` - Crear meta de ahorro
- `GET /api/v1/metas-ahorros` - Listar metas
- `GET /api/v1/metas-ahorros/:id` - Obtener meta específica
- `PUT /api/v1/metas-ahorros/:id` - Actualizar meta
- `DELETE /api/v1/metas-ahorros/:id` - Eliminar meta
- `POST /api/v1/metas-ahorros/:id/movimientos` - Agregar depósito/retiro
- `GET /api/v1/metas-ahorros/:id/movimientos` - Listar movimientos

### Presupuestos
- `POST /api/v1/presupuestos` - Crear presupuesto
- `GET /api/v1/presupuestos` - Listar presupuestos
- `GET /api/v1/presupuestos/:id` - Obtener presupuesto específico
- `PUT /api/v1/presupuestos/:id` - Actualizar presupuesto
- `DELETE /api/v1/presupuestos/:id` - Eliminar presupuesto
- `POST /api/v1/presupuestos/:id/categorias` - Asignar monto a categoría
- `GET /api/v1/presupuestos/:id/progreso` - Ver progreso vs gastos reales

### Dashboard y Estadísticas
- `GET /api/v1/dashboard/resumen` - Resumen financiero general
- `GET /api/v1/dashboard/mensual/:mes/:anio` - Resumen del mes específico
- `GET /api/v1/estadisticas/tendencias` - Tendencias últimos 6 meses
- `GET /api/v1/estadisticas/balance-historico` - Balance histórico
- `GET /api/v1/estadisticas/gastos-categoria` - Gastos por categoría

### Recordatorios
- `POST /api/v1/recordatorios` - Crear recordatorio
- `GET /api/v1/recordatorios` - Listar recordatorios
- `GET /api/v1/recordatorios/proximos` - Recordatorios próximos (7 días)
- `GET /api/v1/recordatorios/:id` - Obtener recordatorio específico
- `PUT /api/v1/recordatorios/:id` - Actualizar recordatorio
- `PATCH /api/v1/recordatorios/:id/completar` - Marcar como completado
- `DELETE /api/v1/recordatorios/:id` - Eliminar recordatorio

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/register`, `/auth/login`, `/auth/refresh-token` y los endpoints públicos de categorías) requieren autenticación mediante JWT.

### Cómo usar:

1. **Registrarse o iniciar sesión** para obtener el token:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Password123"
  }'
```

2. **Incluir el token** en las peticiones subsecuentes:
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/resumen \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

## 📊 Formato de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Respuesta de Error
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

## 🧪 Testing

Ejecutar todos los tests:
```bash
npm test
```

Ejecutar tests en modo watch:
```bash
npm run test:watch
```

Generar reporte de cobertura:
```bash
npm run test:coverage
```

## 📝 Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo (con nodemon)
- `npm start` - Iniciar servidor en modo producción
- `npm test` - Ejecutar tests
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run test:coverage` - Generar reporte de cobertura
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio (GUI para la BD)
- `npm run prisma:seed` - Cargar datos iniciales

## 🔒 Seguridad

El proyecto implementa las siguientes medidas de seguridad:

- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **bcrypt**: Hash de contraseñas con salt rounds
- ✅ **JWT**: Tokens con expiración
- ✅ **Rate Limiting**: Limitación de peticiones
- ✅ **CORS**: Configuración de orígenes permitidos
- ✅ **Validación**: Validación y sanitización de inputs
- ✅ **SQL Injection Protection**: Uso de Prisma ORM
- ✅ **Error Handling**: Manejo centralizado de errores sin exponer detalles internos

## 🌍 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `API_VERSION` | Versión de la API | `v1` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | - |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `JWT_REFRESH_SECRET` | Clave secreta para refresh token | - |
| `JWT_REFRESH_EXPIRES_IN` | Tiempo de expiración del refresh token | `7d` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | `*` |
| `RATE_LIMIT_WINDOW_MS` | Ventana de tiempo para rate limiting | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de peticiones por ventana | `100` |
| `BCRYPT_SALT_ROUNDS` | Rounds de bcrypt | `10` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `DEFAULT_CURRENCY` | Moneda por defecto | `COP` |
| `DEFAULT_TIMEZONE` | Zona horaria por defecto | `America/Bogota` |
| `DEFAULT_LANGUAGE` | Idioma por defecto | `es` |

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL está corriendo
systemctl status postgresql  # Linux
brew services list            # macOS

# Verificar la URL de conexión en .env
echo $DATABASE_URL
```

### Prisma no genera el cliente
```bash
# Limpiar y regenerar
rm -rf node_modules/.prisma
npm run prisma:generate
```

### Error de módulos ES6
Asegúrate de que `package.json` tenga:
```json
{
  "type": "module"
}
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

Desarrollado para el sistema MIDAS - Gestión Financiera Personal

## 📞 Soporte

Para soporte y consultas:
- Email: soporte@midas.com
- Documentación: http://localhost:3000/api-docs

## 🗺️ Roadmap

### Versión 1.1 (Próxima)
- [ ] Sistema de predicciones con IA
- [ ] Generación de reportes en PDF
- [ ] Exportación a Excel/CSV
- [ ] Notificaciones push
- [ ] Gráficos avanzados

### Versión 1.2
- [ ] Multi-moneda con conversión automática
- [ ] Compartir presupuestos entre usuarios
- [ ] Metas de ahorro colaborativas
- [ ] Integración con bancos (Open Banking)
- [ ] App móvil nativa

---

**Hecho con ❤️ para MIDAS**

