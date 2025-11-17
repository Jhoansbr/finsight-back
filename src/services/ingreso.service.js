import prisma from '../config/database.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';

export const ingresoService = {
  /**
   * Crear nuevo ingreso
   */
  async createIngreso(userId, ingresoData) {
    const ingreso = await prisma.ingreso.create({
      data: {
        usuarioId: userId,
        categoriaId: ingresoData.categoriaId,
        monto: ingresoData.monto,
        descripcion: ingresoData.descripcion,
        fecha: ingresoData.fecha,
        tipoPagoId: ingresoData.tipoPagoId,
        esRecurrente: ingresoData.esRecurrente || false,
        frecuenciaId: ingresoData.frecuenciaId,
        fechaInicio: ingresoData.fechaInicio,
        fechaFin: ingresoData.fechaFin,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    return ingreso;
  },

  /**
   * Listar ingresos del usuario con filtros
   */
  async getIngresos(userId, filters = {}) {
    const { page = 1, limit = 20, fechaInicio, fechaFin, categoriaId, esRecurrente } = filters;
    
    const skip = (page - 1) * limit;
    const where = {
      usuarioId: userId,
      activo: true,
    };

    // Filtros opcionales
    if (fechaInicio && fechaFin) {
      where.fecha = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    }

    if (categoriaId) {
      where.categoriaId = parseInt(categoriaId);
    }

    if (esRecurrente !== undefined) {
      where.esRecurrente = esRecurrente === 'true';
    }

    // Obtener ingresos paginados
    const [ingresos, total] = await Promise.all([
      prisma.ingreso.findMany({
        where,
        include: {
          categoria: true,
          tipoPago: true,
          frecuencia: true,
        },
        orderBy: { fecha: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.ingreso.count({ where }),
    ]);

    return {
      ingresos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },

  /**
   * Obtener ingreso por ID
   */
  async getIngresoById(userId, ingresoId) {
    const ingreso = await prisma.ingreso.findFirst({
      where: {
        id: ingresoId,
        usuarioId: userId,
        activo: true,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    if (!ingreso) {
      throw new NotFoundError('Ingreso');
    }

    return ingreso;
  },

  /**
   * Actualizar ingreso
   */
  async updateIngreso(userId, ingresoId, ingresoData) {
    // Verificar que el ingreso pertenece al usuario
    const existingIngreso = await prisma.ingreso.findFirst({
      where: {
        id: ingresoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingIngreso) {
      throw new NotFoundError('Ingreso');
    }

    // Actualizar
    const ingreso = await prisma.ingreso.update({
      where: { id: ingresoId },
      data: {
        categoriaId: ingresoData.categoriaId,
        monto: ingresoData.monto,
        descripcion: ingresoData.descripcion,
        fecha: ingresoData.fecha,
        tipoPagoId: ingresoData.tipoPagoId,
        esRecurrente: ingresoData.esRecurrente,
        frecuenciaId: ingresoData.frecuenciaId,
        fechaInicio: ingresoData.fechaInicio,
        fechaFin: ingresoData.fechaFin,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    return ingreso;
  },

  /**
   * Eliminar ingreso (soft delete)
   */
  async deleteIngreso(userId, ingresoId) {
    // Verificar que el ingreso pertenece al usuario
    const existingIngreso = await prisma.ingreso.findFirst({
      where: {
        id: ingresoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingIngreso) {
      throw new NotFoundError('Ingreso');
    }

    // Soft delete
    await prisma.ingreso.update({
      where: { id: ingresoId },
      data: { activo: false },
    });

    return { message: 'Ingreso eliminado exitosamente' };
  },

  /**
   * Obtener suma total de ingresos en un período
   */
  async getTotalIngresos(userId, fechaInicio, fechaFin) {
    const result = await prisma.ingreso.aggregate({
      where: {
        usuarioId: userId,
        activo: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
      },
      _sum: {
        monto: true,
      },
    });

    return result._sum.monto || 0;
  },
};

