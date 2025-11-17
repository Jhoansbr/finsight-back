import prisma from '../config/database.js';

export const dashboardService = {
  /**
   * Obtener resumen financiero general
   */
  async getResumen(userId) {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);

    // Obtener totales del mes actual
    const [ingresosResult, gastosResult, metasAhorro, recordatoriosPendientes] = await Promise.all([
      // Total ingresos del mes
      prisma.ingreso.aggregate({
        where: {
          usuarioId: userId,
          activo: true,
          fecha: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        _sum: { monto: true },
      }),
      // Total gastos del mes
      prisma.gasto.aggregate({
        where: {
          usuarioId: userId,
          activo: true,
          fecha: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        _sum: { monto: true },
      }),
      // Metas de ahorro activas
      prisma.metaAhorro.findMany({
        where: {
          usuarioId: userId,
          activo: true,
          estado: 'en_progreso',
        },
        select: {
          id: true,
          nombre: true,
          montoObjetivo: true,
          montoActual: true,
        },
      }),
      // Recordatorios pendientes
      prisma.recordatorio.count({
        where: {
          usuarioId: userId,
          activo: true,
          completado: false,
          fecha: {
            gte: hoy,
          },
        },
      }),
    ]);

    const totalIngresosMes = parseFloat(ingresosResult._sum.monto || 0);
    const totalGastosMes = parseFloat(gastosResult._sum.monto || 0);
    const balanceMes = totalIngresosMes - totalGastosMes;

    // Calcular progreso de metas
    const metasConProgreso = metasAhorro.map(meta => ({
      id: meta.id,
      nombre: meta.nombre,
      montoObjetivo: parseFloat(meta.montoObjetivo),
      montoActual: parseFloat(meta.montoActual),
      progreso: parseFloat(meta.montoObjetivo) > 0 
        ? ((parseFloat(meta.montoActual) / parseFloat(meta.montoObjetivo)) * 100).toFixed(2)
        : 0,
    }));

    return {
      mesActual: {
        mes: hoy.getMonth() + 1,
        anio: hoy.getFullYear(),
        totalIngresos: totalIngresosMes,
        totalGastos: totalGastosMes,
        balance: balanceMes,
      },
      metasAhorro: {
        activas: metasAhorro.length,
        metas: metasConProgreso,
      },
      recordatoriosPendientes,
    };
  },

  /**
   * Obtener resumen mensual específico
   */
  async getResumenMensual(userId, mes, anio) {
    const inicioMes = new Date(anio, mes - 1, 1);
    const finMes = new Date(anio, mes, 0, 23, 59, 59);

    // Totales del mes
    const [ingresosResult, gastosResult, gastosCategoria] = await Promise.all([
      // Total ingresos
      prisma.ingreso.aggregate({
        where: {
          usuarioId: userId,
          activo: true,
          fecha: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        _sum: { monto: true },
        _count: true,
      }),
      // Total gastos
      prisma.gasto.aggregate({
        where: {
          usuarioId: userId,
          activo: true,
          fecha: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        _sum: { monto: true },
        _count: true,
      }),
      // Gastos por categoría
      prisma.gasto.groupBy({
        by: ['categoriaId'],
        where: {
          usuarioId: userId,
          activo: true,
          fecha: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        _sum: { monto: true },
      }),
    ]);

    // Enriquecer gastos por categoría con nombres
    const gastosConCategoria = await Promise.all(
      gastosCategoria.map(async (gasto) => {
        const categoria = await prisma.categoria.findUnique({
          where: { id: gasto.categoriaId },
        });

        return {
          categoriaId: gasto.categoriaId,
          categoriaNombre: categoria?.nombre,
          categoriaColor: categoria?.color,
          categoriaIcono: categoria?.icono,
          total: parseFloat(gasto._sum.monto || 0),
        };
      })
    );

    const totalIngresos = parseFloat(ingresosResult._sum.monto || 0);
    const totalGastos = parseFloat(gastosResult._sum.monto || 0);
    const balance = totalIngresos - totalGastos;

    return {
      periodo: {
        mes,
        anio,
      },
      resumen: {
        totalIngresos,
        cantidadIngresos: ingresosResult._count,
        totalGastos,
        cantidadGastos: gastosResult._count,
        balance,
        tasaAhorro: totalIngresos > 0 ? ((balance / totalIngresos) * 100).toFixed(2) : 0,
      },
      gastosPorCategoria: gastosConCategoria.sort((a, b) => b.total - a.total),
    };
  },

  /**
   * Obtener tendencias (últimos 6 meses)
   */
  async getTendencias(userId) {
    const hoy = new Date();
    const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 6, 1);

    const tendencias = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      const inicioMes = new Date(anio, mes - 1, 1);
      const finMes = new Date(anio, mes, 0, 23, 59, 59);

      const [ingresos, gastos] = await Promise.all([
        prisma.ingreso.aggregate({
          where: {
            usuarioId: userId,
            activo: true,
            fecha: {
              gte: inicioMes,
              lte: finMes,
            },
          },
          _sum: { monto: true },
        }),
        prisma.gasto.aggregate({
          where: {
            usuarioId: userId,
            activo: true,
            fecha: {
              gte: inicioMes,
              lte: finMes,
            },
          },
          _sum: { monto: true },
        }),
      ]);

      const totalIngresos = parseFloat(ingresos._sum.monto || 0);
      const totalGastos = parseFloat(gastos._sum.monto || 0);

      tendencias.push({
        mes,
        anio,
        periodo: `${anio}-${mes.toString().padStart(2, '0')}`,
        ingresos: totalIngresos,
        gastos: totalGastos,
        balance: totalIngresos - totalGastos,
      });
    }

    return tendencias;
  },

  /**
   * Obtener balance histórico
   */
  async getBalanceHistorico(userId, meses = 12) {
    const hoy = new Date();
    const historico = [];

    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      const inicioMes = new Date(anio, mes - 1, 1);
      const finMes = new Date(anio, mes, 0, 23, 59, 59);

      const [ingresos, gastos] = await Promise.all([
        prisma.ingreso.aggregate({
          where: {
            usuarioId: userId,
            activo: true,
            fecha: {
              gte: inicioMes,
              lte: finMes,
            },
          },
          _sum: { monto: true },
        }),
        prisma.gasto.aggregate({
          where: {
            usuarioId: userId,
            activo: true,
            fecha: {
              gte: inicioMes,
              lte: finMes,
            },
          },
          _sum: { monto: true },
        }),
      ]);

      const totalIngresos = parseFloat(ingresos._sum.monto || 0);
      const totalGastos = parseFloat(gastos._sum.monto || 0);
      const balance = totalIngresos - totalGastos;

      historico.push({
        mes,
        anio,
        periodo: `${anio}-${mes.toString().padStart(2, '0')}`,
        ingresos: totalIngresos,
        gastos: totalGastos,
        balance,
        tasaAhorro: totalIngresos > 0 ? ((balance / totalIngresos) * 100).toFixed(2) : 0,
      });
    }

    return historico;
  },

  /**
   * Obtener estadísticas de gastos por categoría
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
      _sum: { monto: true },
      _count: true,
    });

    // Total de gastos
    const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g._sum.monto || 0), 0);

    // Enriquecer con información de categoría
    const gastosConCategoria = await Promise.all(
      gastos.map(async (gasto) => {
        const categoria = await prisma.categoria.findUnique({
          where: { id: gasto.categoriaId },
        });

        const total = parseFloat(gasto._sum.monto || 0);
        const porcentaje = totalGastos > 0 ? ((total / totalGastos) * 100).toFixed(2) : 0;

        return {
          categoriaId: gasto.categoriaId,
          categoriaNombre: categoria?.nombre,
          categoriaColor: categoria?.color,
          categoriaIcono: categoria?.icono,
          total,
          cantidad: gasto._count,
          porcentaje: parseFloat(porcentaje),
        };
      })
    );

    return {
      totalGastos,
      categorias: gastosConCategoria.sort((a, b) => b.total - a.total),
    };
  },
};

