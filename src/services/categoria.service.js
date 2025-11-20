import prisma from '../config/database.js';

export const categoriaService = {
  /**
   * Listar todas las categorías activas
   */
  async getAllCategorias(tipo = null) {
    const where = { activo: true };
    
    if (tipo) {
      where.tipo = tipo;
    }

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return categorias;
  },

  /**
   * Listar tipos de pago activos
   */
  async getAllTiposPago() {
    const tiposPago = await prisma.tipoPago.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });

    return tiposPago;
  },

  /**
   * Listar frecuencias activas
   */
  async getAllFrecuencias() {
    const frecuencias = await prisma.frecuencia.findMany({
      where: { activo: true },
      orderBy: { diasIntervalo: 'asc' },
    });

    return frecuencias;
  },
};

