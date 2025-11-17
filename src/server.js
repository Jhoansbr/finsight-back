import 'dotenv/config';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y arrancar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
    const server = app.listen(PORT, '0.0.0.0', () => {
      const isProduction = process.env.NODE_ENV === 'production';
      const baseUrl = isProduction 
        ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}`
        : `http://localhost:${PORT}`;
      
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Documentation: ${baseUrl}/api-docs`);
      logger.info(`🏥 Health Check: ${baseUrl}/health`);
      logger.info(`🔗 API Base URL: ${baseUrl}/api/${process.env.API_VERSION || 'v1'}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejo de señales de cierre
    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received, starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Desconectar de la base de datos
        await disconnectDatabase();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // En producción, podrías querer cerrar el servidor
      // gracefulShutdown('UNHANDLED_REJECTION');
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

