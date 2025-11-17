import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usuarioRoutes from './usuario.routes.js';
import categoriaRoutes from './categoria.routes.js';
import ingresoRoutes from './ingreso.routes.js';
import gastoRoutes from './gasto.routes.js';
import metaAhorroRoutes from './metaAhorro.routes.js';
import presupuestoRoutes from './presupuesto.routes.js';
import recordatorioRoutes from './recordatorio.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import testRoutes from './test.routes.js';

const router = Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/users', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/', categoriaRoutes); // Para /tipos-pago y /frecuencias
router.use('/ingresos', ingresoRoutes);
router.use('/gastos', gastoRoutes);
router.use('/metas-ahorros', metaAhorroRoutes);
router.use('/presupuestos', presupuestoRoutes);
router.use('/recordatorios', recordatorioRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/', dashboardRoutes); // Para /estadisticas
router.use('/test', testRoutes); // Endpoints de prueba temporal

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MIDAS API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

