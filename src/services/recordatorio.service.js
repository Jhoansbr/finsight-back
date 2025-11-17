import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const recordatorioService = {
  /**
   * Crear nuevo recordatorio
   */
  async createRecordatorio(userId, recordatorioData) {
    const recordatorio = await prisma.recordatorio.create({
      data: {
        usuarioId: userId,
        titulo: recordatorioData.titulo,
        descripcion: recordatorioData.descripcion,
        fecha: recordatorioData.fecha,
        tipo: recordatorioData.tipo,
      },
    });

    return recordatorio;
  },

  /**
   * Listar recordatorios del usuario
   */
  async getRecordatorios(userId, filters = {}) {
    const { page = 1, limit = 20, completado, tipo } = filters;
    
    const skip = (page - 1) * limit;
    const where = {
      usuarioId: userId,
      activo: true,
    };

    if (completado !== undefined) {
      where.completado = completado === 'true';
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const [recordatorios, total] = await Promise.all([
      prisma.recordatorio.findMany({
        where,
        orderBy: [
          { completado: 'asc' },
          { fecha: 'asc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.recordatorio.count({ where }),
    ]);

    return {
      recordatorios,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  },

  /**
   * Obtener recordatorio por ID
   */
  async getRecordatorioById(userId, recordatorioId) {
    const recordatorio = await prisma.recordatorio.findFirst({
      where: {
        id: recordatorioId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!recordatorio) {
      throw new NotFoundError('Recordatorio');
    }

    return recordatorio;
  },

  /**
   * Actualizar recordatorio
   */
  async updateRecordatorio(userId, recordatorioId, recordatorioData) {
    // Verificar que el recordatorio pertenece al usuario
    const existingRecordatorio = await prisma.recordatorio.findFirst({
      where: {
        id: recordatorioId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingRecordatorio) {
      throw new NotFoundError('Recordatorio');
    }

    // Actualizar
    const recordatorio = await prisma.recordatorio.update({
      where: { id: recordatorioId },
      data: {
        titulo: recordatorioData.titulo,
        descripcion: recordatorioData.descripcion,
        fecha: recordatorioData.fecha,
        tipo: recordatorioData.tipo,
        completado: recordatorioData.completado,
      },
    });

    return recordatorio;
  },

  /**
   * Marcar recordatorio como completado
   */
  async markAsCompleted(userId, recordatorioId) {
    // Verificar que el recordatorio pertenece al usuario
    const existingRecordatorio = await prisma.recordatorio.findFirst({
      where: {
        id: recordatorioId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingRecordatorio) {
      throw new NotFoundError('Recordatorio');
    }

    // Marcar como completado
    const recordatorio = await prisma.recordatorio.update({
      where: { id: recordatorioId },
      data: { completado: true },
    });

    return recordatorio;
  },

  /**
   * Eliminar recordatorio
   */
  async deleteRecordatorio(userId, recordatorioId) {
    // Verificar que el recordatorio pertenece al usuario
    const existingRecordatorio = await prisma.recordatorio.findFirst({
      where: {
        id: recordatorioId,
        usuarioId: userId,
        activo: true,
      },
    });

    if (!existingRecordatorio) {
      throw new NotFoundError('Recordatorio');
    }

    // Soft delete
    await prisma.recordatorio.update({
      where: { id: recordatorioId },
      data: { activo: false },
    });

    return { message: 'Recordatorio eliminado exitosamente' };
  },

  /**
   * Obtener recordatorios pendientes (próximos 7 días)
   */
  async getUpcomingRecordatorios(userId) {
    const hoy = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);

    const recordatorios = await prisma.recordatorio.findMany({
      where: {
        usuarioId: userId,
        activo: true,
        completado: false,
        fecha: {
          gte: hoy,
          lte: en7Dias,
        },
      },
      orderBy: { fecha: 'asc' },
    });

    return recordatorios;
  },
};

