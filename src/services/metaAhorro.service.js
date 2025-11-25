import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const metaAhorroService = {
  /**
   * Crear nueva meta de ahorro
   */
  async createMetaAhorro(userId, metaData) {
    const meta = await prisma.metaAhorro.create({
      data: {
        usuarioId: userId,
        nombre: metaData.nombre,
        descripcion: metaData.descripcion,
        montoObjetivo: metaData.montoObjetivo,
        fechaInicio: metaData.fechaInicio,
        fechaObjetivo: metaData.fechaObjetivo,
        fechaInicio: metaData.fechaInicio,
        fechaObjetivo: metaData.fechaObjetivo,
      },
    });

    return meta;
  },

  /**
   * Listar metas de ahorro del usuario
   */
  async getMetasAhorro(userId, filters = {}) {
    const { page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const where = {
      usuarioId: userId,
      activo: true,
    };

    const [metas, total] = await Promise.all([
      prisma.metaAhorro.findMany({
        where,
        orderBy: [
          { fechaObjetivo: 'asc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.metaAhorro.count({ where }),
    ]);

    // Calcular progreso para cada meta
    const metasConProgreso = metas.map(meta => ({
      ...meta,
      progreso: meta.montoObjetivo > 0
        ? ((parseFloat(meta.montoActual) / parseFloat(meta.montoObjetivo)) * 100).toFixed(2)
        : 0,
    }));

    return {
      metas: metasConProgreso,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },

  /**
   * Obtener meta de ahorro por ID
   */
  async getMetaAhorroById(userId, metaId) {
    const meta = await prisma.metaAhorro.findFirst({
      where: {
        id: metaId,
        usuarioId: userId,
        activo: true,
      },
      include: {
        ahorros: {
          orderBy: { fecha: 'desc' },
          take: 10,
        },
      },
    });

    if (!meta) {
      throw new NotFoundError('Meta de ahorro');
    }

    // Calcular progreso
    const progreso = meta.montoObjetivo > 0
      ? ((parseFloat(meta.montoActual) / parseFloat(meta.montoObjetivo)) * 100).toFixed(2)
      : 0;

    return {
      ...meta,
      progreso,
    };
  },

  /**
   * Actualizar meta de ahorro
   */
  async updateMetaAhorro(userId, metaId, metaData) {
    // Verificar que la meta pertenece al usuario
    const existingMeta = await prisma.metaAhorro.findFirst({
      where: {
        id: metaId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingMeta) {
      throw new NotFoundError('Meta de ahorro');
    }

    // Actualizar
    const meta = await prisma.metaAhorro.update({
      where: { id: metaId },
      data: {
        nombre: metaData.nombre,
        descripcion: metaData.descripcion,
        montoObjetivo: metaData.montoObjetivo,
        fechaInicio: metaData.fechaInicio,
        fechaObjetivo: metaData.fechaObjetivo,
        fechaInicio: metaData.fechaInicio,
        fechaObjetivo: metaData.fechaObjetivo,
      },
    });

    return meta;
  },

  /**
   * Eliminar meta de ahorro
   */
  async deleteMetaAhorro(userId, metaId) {
    // Verificar que la meta pertenece al usuario
    const existingMeta = await prisma.metaAhorro.findFirst({
      where: {
        id: metaId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingMeta) {
      throw new NotFoundError('Meta de ahorro');
    }

    // Soft delete
    await prisma.metaAhorro.update({
      where: { id: metaId },
      data: { activo: false },
    });

    return { message: 'Meta de ahorro eliminada exitosamente' };
  },

  /**
   * Agregar movimiento (depósito o retiro)
   */
  async addMovimiento(userId, metaId, movimientoData) {
    // Verificar que la meta pertenece al usuario
    const meta = await prisma.metaAhorro.findFirst({
      where: {
        id: metaId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!meta) {
      throw new NotFoundError('Meta de ahorro');
    }

    // Validar retiro
    if (movimientoData.tipoMovimiento === 'retiro') {
      const nuevoMonto = parseFloat(meta.montoActual) - parseFloat(movimientoData.monto);
      if (nuevoMonto < 0) {
        throw new ValidationError('Fondos insuficientes para el retiro');
      }
    }

    // Crear movimiento
    const ahorro = await prisma.ahorro.create({
      data: {
        metaAhorroId: parseInt(metaId),
        usuarioId: userId,
        nombre: movimientoData.nombre || (movimientoData.tipoMovimiento === 'deposito' ? 'Depósito a Meta' : 'Retiro de Meta'),
        tipoMovimiento: movimientoData.tipoMovimiento,
        monto: movimientoData.monto,
        lugar: movimientoData.lugar,
        descripcion: movimientoData.descripcion,
        fecha: movimientoData.fecha || new Date(),
      },
    });

    // Actualizar monto actual de la meta
    const nuevoMontoActual = movimientoData.tipoMovimiento === 'deposito'
      ? parseFloat(meta.montoActual) + parseFloat(movimientoData.monto)
      : parseFloat(meta.montoActual) - parseFloat(movimientoData.monto);

    // Actualizar estado si se completó la meta
    const updateData = {
      montoActual: nuevoMontoActual,
    };

    if (nuevoMontoActual >= parseFloat(meta.montoObjetivo)) {
      // Meta completada (lógica implícita, ya que no hay campo estado)
    }

    await prisma.metaAhorro.update({
      where: { id: metaId },
      data: updateData,
    });

    return ahorro;
  },

  /**
   * Obtener historial de movimientos
   */
  async getMovimientos(userId, metaId, filters = {}) {
    // Verificar que la meta pertenece al usuario
    const meta = await prisma.metaAhorro.findFirst({
      where: {
        id: metaId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!meta) {
      throw new NotFoundError('Meta de ahorro');
    }

    const { page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const [movimientos, total] = await Promise.all([
      prisma.ahorro.findMany({
        where: { metaId },
        orderBy: { fecha: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.ahorro.count({ where: { metaId } }),
    ]);

    return {
      movimientos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },
};

