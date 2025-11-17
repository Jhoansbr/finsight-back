import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MIDAS API - Sistema de Gestión Financiera Personal',
      version: '1.0.0',
      description: 'API REST para el sistema MIDAS de gestión de finanzas personales. Permite control de ingresos, gastos, ahorros, presupuestos y predicciones financieras.',
      contact: {
        name: 'MIDAS Team',
        email: 'soporte@midas.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api/${process.env.API_VERSION || 'v1'}`,
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.midas.com/api/v1',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT generado al iniciar sesión',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'ERROR_CODE',
                },
                message: {
                  type: 'string',
                  example: 'Mensaje descriptivo del error',
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            meta: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                },
                limit: {
                  type: 'integer',
                },
                total: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Autenticación y gestión de usuarios',
      },
      {
        name: 'Usuarios',
        description: 'Gestión de perfil y preferencias de usuario',
      },
      {
        name: 'Categorías',
        description: 'Categorías de ingresos y gastos',
      },
      {
        name: 'Ingresos',
        description: 'Gestión de ingresos',
      },
      {
        name: 'Gastos',
        description: 'Gestión de gastos',
      },
      {
        name: 'Metas de Ahorro',
        description: 'Gestión de metas de ahorro',
      },
      {
        name: 'Presupuestos',
        description: 'Gestión de presupuestos',
      },
      {
        name: 'Dashboard',
        description: 'Resumen y estadísticas financieras',
      },
      {
        name: 'Recordatorios',
        description: 'Gestión de recordatorios',
      },
      {
        name: 'Predicciones',
        description: 'Predicciones financieras con IA',
      },
      {
        name: 'Reportes',
        description: 'Generación de reportes',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path a los archivos de rutas
};

export const swaggerSpec = swaggerJsdoc(options);

