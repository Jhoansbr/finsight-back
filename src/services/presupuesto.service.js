import prisma from '../config/database.js';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors.js';

export const presupuestoService = {
  /**
   * Crear nuevo presupuesto
   */
  async createPresupuesto(userId, presupuestoData) {
    // Verificar que no exista ya un presupuesto para ese mes/año
    const existingPresupuesto = await prisma.presupuesto.findUnique({
      where: {
        usuarioId_mes_anio: {
          usuarioId: userId,
          mes: presupuestoData.mes,
          anio: presupuestoData.anio,
        },
      },
    });

    if (existingPresupuesto && existingPresupuesto.activo) {
      throw new ConflictError(`Ya existe un presupuesto para ${presupuestoData.mes}/${presupuestoData.anio}`);
    }

    const presupuesto = await prisma.presupuesto.create({
      data: {
        usuarioId: userId,
        nombre: presupuestoData.nombre,
        mes: presupuestoData.mes,
        anio: presupuestoData.anio,
        montoTotal: presupuestoData.montoTotal,
        descripcion: presupuestoData.descripcion,
      },
    });

    return presupuesto;
  },

  /**
   * Listar presupuestos del usuario
   */
  async getPresupuestos(userId, filters = {}) {
    const { page = 1, limit = 20, mes, anio } = filters;
    
    const skip = (page - 1) * limit;
    const where = {
      usuarioId: userId,
      activo: true,
    };

    if (mes) {
      where.mes = parseInt(mes);
    }

    if (anio) {
      where.anio = parseInt(anio);
    }

    const [presupuestos, total] = await Promise.all([
      prisma.presupuesto.findMany({
        where,
        include: {
          categorias: {
            include: {
              categoria: true,
            },
          },
        },
        orderBy: [
          { anio: 'desc' },
          { mes: 'desc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.presupuesto.count({ where }),
    ]);

    return {
      presupuestos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },

  /**
   * Obtener presupuesto por ID
   */
  async getPresupuestoById(userId, presupuestoId) {
    const presupuesto = await prisma.presupuesto.findFirst({
      where: {
        id: presupuestoId,
        usuarioId: userId,
        activo: true,
      },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    });

    if (!presupuesto) {
      throw new NotFoundError('Presupuesto');
    }

    return presupuesto;
  },

  /**
   * Actualizar presupuesto
   */
  async updatePresupuesto(userId, presupuestoId, presupuestoData) {
    // Verificar que el presupuesto pertenece al usuario
    const existingPresupuesto = await prisma.presupuesto.findFirst({
      where: {
        id: presupuestoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingPresupuesto) {
      throw new NotFoundError('Presupuesto');
    }

    // Actualizar
    const presupuesto = await prisma.presupuesto.update({
      where: { id: presupuestoId },
      data: {
        nombre: presupuestoData.nombre,
        montoTotal: presupuestoData.montoTotal,
        descripcion: presupuestoData.descripcion,
      },
    });

    return presupuesto;
  },

  /**
   * Eliminar presupuesto
   */
  async deletePresupuesto(userId, presupuestoId) {
    // Verificar que el presupuesto pertenece al usuario
    const existingPresupuesto = await prisma.presupuesto.findFirst({
      where: {
        id: presupuestoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingPresupuesto) {
      throw new NotFoundError('Presupuesto');
    }

    // Soft delete
    await prisma.presupuesto.update({
      where: { id: presupuestoId },
      data: { activo: false },
    });

    return { message: 'Presupuesto eliminado exitosamente' };
  },

  /**
   * Asignar monto a categoría
   */
  async assignCategoria(userId, presupuestoId, categoriaData) {
    // Verificar que el presupuesto pertenece al usuario
    const presupuesto = await prisma.presupuesto.findFirst({
      where: {
        id: presupuestoId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!presupuesto) {
      throw new NotFoundError('Presupuesto');
    }

    // Crear o actualizar categoría del presupuesto
    const categoriaPresupuesto = await prisma.presupuestoCategoria.upsert({
      where: {
        presupuestoId_categoriaId: {
          presupuestoId,
          categoriaId: categoriaData.categoriaId,
        },
      },
      update: {
        montoAsignado: categoriaData.montoAsignado,
      },
      create: {
        presupuestoId,
        categoriaId: categoriaData.categoriaId,
        montoAsignado: categoriaData.montoAsignado,
      },
      include: {
        categoria: true,
      },
    });

    return categoriaPresupuesto;
  },

  /**
   * Obtener progreso del presupuesto vs gastos reales
   */
  async getProgreso(userId, presupuestoId) {
    // Verificar que el presupuesto pertenece al usuario
    const presupuesto = await prisma.presupuesto.findFirst({
      where: {
        id: presupuestoId,
        usuarioId: userId,
        activo: true,
      },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    });

    if (!presupuesto) {
      throw new NotFoundError('Presupuesto');
    }

    // Calcular fechas del mes del presupuesto
    const fechaInicio = new Date(presupuesto.anio, presupuesto.mes - 1, 1);
    const fechaFin = new Date(presupuesto.anio, presupuesto.mes, 0, 23, 59, 59);

    // Obtener gastos reales por categoría
    const gastosReales = await prisma.gasto.groupBy({
      by: ['categoriaId'],
      where: {
        usuarioId: userId,
        activo: true,
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      _sum: {
        monto: true,
      },
    });

    // Mapear gastos por categoría
    const gastosMap = {};
    gastosReales.forEach(gasto => {
      gastosMap[gasto.categoriaId] = parseFloat(gasto._sum.monto || 0);
    });

    // Calcular progreso por categoría
    const categoriasConProgreso = presupuesto.categorias.map(cat => {
      const gastoReal = gastosMap[cat.categoriaId] || 0;
      const montoAsignado = parseFloat(cat.montoAsignado);
      const porcentajeUsado = montoAsignado > 0 ? (gastoReal / montoAsignado * 100).toFixed(2) : 0;
      const restante = montoAsignado - gastoReal;

      return {
        categoriaId: cat.categoriaId,
        categoriaNombre: cat.categoria.nombre,
        categoriaColor: cat.categoria.color,
        categoriaIcono: cat.categoria.icono,
        montoAsignado,
        montoGastado: gastoReal,
        restante,
        porcentajeUsado: parseFloat(porcentajeUsado),
        excedido: gastoReal > montoAsignado,
      };
    });

    // Calcular totales
    const totalAsignado = parseFloat(presupuesto.montoTotal);
    const totalGastado = Object.values(gastosMap).reduce((sum, val) => sum + val, 0);
    const totalRestante = totalAsignado - totalGastado;
    const porcentajeTotalUsado = totalAsignado > 0 ? (totalGastado / totalAsignado * 100).toFixed(2) : 0;

    return {
      presupuesto: {
        id: presupuesto.id,
        nombre: presupuesto.nombre,
        mes: presupuesto.mes,
        anio: presupuesto.anio,
      },
      resumen: {
        totalAsignado,
        totalGastado,
        totalRestante,
        porcentajeTotalUsado: parseFloat(porcentajeTotalUsado),
        excedido: totalGastado > totalAsignado,
      },
      categorias: categoriasConProgreso,
    };
  },
};

