import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = Router();

// Test sin validación
router.post('/gasto-directo', authenticate, async (req, res, next) => {
  try {
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('📥 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('👤 Usuario:', req.user);

    const { nombre, categoriaId, monto, fecha, descripcion, tipoPagoId } = req.body;

    // Validación manual simple
    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Falta el campo "nombre"',
          details: { campo_faltante: 'nombre', body_recibido: req.body }
        }
      });
    }

    if (!categoriaId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Falta el campo "categoriaId"',
          details: { campo_faltante: 'categoriaId', body_recibido: req.body }
        }
      });
    }

    if (!monto) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Falta el campo "monto"',
          details: { campo_faltante: 'monto', body_recibido: req.body }
        }
      });
    }

    if (!fecha) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Falta el campo "fecha"',
          details: { campo_faltante: 'fecha', body_recibido: req.body }
        }
      });
    }

    // Crear el gasto directamente
    const gasto = await prisma.gasto.create({
      data: {
        usuarioId: req.user.id,
        nombre: nombre,
        categoriaId: parseInt(categoriaId),
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion: descripcion || null,
        tipoPagoId: tipoPagoId ? parseInt(tipoPagoId) : null,
        esRecurrente: false,
        activo: true,
      },
    });

    res.status(201).json({
      success: true,
      message: '✅ Gasto creado exitosamente (endpoint de prueba)',
      data: gasto
    });
  } catch (error) {
    console.error('❌ Error al crear gasto:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ERROR',
        message: error.message,
        details: {
          name: error.name,
          code: error.code,
          meta: error.meta
        }
      }
    });
  }
});

// Test de echo - devuelve lo que recibe
router.post('/echo', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Echo de tu request',
    data: {
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'Bearer ...' : 'No presente'
      },
      user: req.user
    }
  });
});

export default router;

