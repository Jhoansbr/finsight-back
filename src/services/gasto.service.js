import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const gastoService = {
  /**
   * Crear nuevo gasto
   */
  async createGasto(userId, gastoData) {
    const gasto = await prisma.gasto.create({
      data: {
        usuarioId: userId,
        nombre: gastoData.nombre,
        categoriaId: gastoData.categoriaId,
        monto: gastoData.monto,
        descripcion: gastoData.descripcion,
        fecha: gastoData.fecha,
        tipoPagoId: gastoData.tipoPagoId,
        esRecurrente: gastoData.esRecurrente || false,
        frecuenciaId: gastoData.frecuenciaId,
        fechaInicio: gastoData.fechaInicio,
        fechaFin: gastoData.fechaFin,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    return gasto;
  },

  /**
   * Listar gastos del usuario con filtros
   */
  async getGastos(userId, filters = {}) {
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

    // Obtener gastos paginados
    const [gastos, total] = await Promise.all([
      prisma.gasto.findMany({
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
      prisma.gasto.count({ where }),
    ]);

    return {
      gastos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },

  /**
   * Obtener gasto por ID
   */
  async getGastoById(userId, gastoId) {
    const gasto = await prisma.gasto.findFirst({
      where: {
        id: gastoId,
        usuarioId: userId,
        activo: true,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    if (!gasto) {
      throw new NotFoundError('Gasto');
    }

    return gasto;
  },

  /**
   * Actualizar gasto
   */
  async updateGasto(userId, gastoId, gastoData) {
    // Verificar que el gasto pertenece al usuario
    const existingGasto = await prisma.gasto.findFirst({
      where: {
        id: gastoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingGasto) {
      throw new NotFoundError('Gasto');
    }

    // Actualizar
    const gasto = await prisma.gasto.update({
      where: { id: gastoId },
      data: {
        nombre: gastoData.nombre,
        categoriaId: gastoData.categoriaId,
        monto: gastoData.monto,
        descripcion: gastoData.descripcion,
        fecha: gastoData.fecha,
        tipoPagoId: gastoData.tipoPagoId,
        esRecurrente: gastoData.esRecurrente,
        frecuenciaId: gastoData.frecuenciaId,
        fechaInicio: gastoData.fechaInicio,
        fechaFin: gastoData.fechaFin,
      },
      include: {
        categoria: true,
        tipoPago: true,
        frecuencia: true,
      },
    });

    return gasto;
  },

  /**
   * Eliminar gasto (soft delete)
   */
  async deleteGasto(userId, gastoId) {
    // Verificar que el gasto pertenece al usuario
    const existingGasto = await prisma.gasto.findFirst({
      where: {
        id: gastoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingGasto) {
      throw new NotFoundError('Gasto');
    }

    // Soft delete
    await prisma.gasto.update({
      where: { id: gastoId },
      data: { activo: false },
    });

    return { message: 'Gasto eliminado exitosamente' };
  },

  /**
   * Obtener suma total de gastos en un período
   */
  async getTotalGastos(userId, fechaInicio, fechaFin) {
    const result = await prisma.gasto.aggregate({
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

  /**
   * Obtener gastos por categoría en un período
   */
  async getGastosPorCategoria(userId, fechaInicio, fechaFin) {
    const gastos = await prisma.gasto.groupBy({
      by: ['categoriaId'],
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

    // Obtener nombres de categorías
    const gastosConCategorias = await Promise.all(
      gastos.map(async (gasto) => {
        const categoria = await prisma.categoria.findUnique({
          where: { id: gasto.categoriaId },
        });

        return {
          categoria: categoria?.nombre,
          categoriaId: gasto.categoriaId,
          color: categoria?.color,
          icono: categoria?.icono,
          total: gasto._sum.monto || 0,
        };
      })
    );

    return gastosConCategorias;
  },
};

