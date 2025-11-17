import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Seed de Categorías
  console.log('📁 Creando categorías...');
  
  const categorias = [
    // Categorías de Ingresos
    { nombre: 'Salario', tipo: 'ingreso', icono: '💰', color: '#4CAF50', descripcion: 'Salario mensual' },
    { nombre: 'Freelance', tipo: 'ingreso', icono: '💼', color: '#2196F3', descripcion: 'Trabajos independientes' },
    { nombre: 'Bonos', tipo: 'ingreso', icono: '🎁', color: '#FFC107', descripcion: 'Bonificaciones y premios' },
    { nombre: 'Inversiones', tipo: 'ingreso', icono: '📈', color: '#9C27B0', descripcion: 'Rendimientos de inversiones' },
    { nombre: 'Ventas', tipo: 'ingreso', icono: '🛍️', color: '#FF9800', descripcion: 'Ventas de productos o servicios' },
    { nombre: 'Alquileres', tipo: 'ingreso', icono: '🏠', color: '#795548', descripcion: 'Ingresos por alquileres' },
    { nombre: 'Otros Ingresos', tipo: 'ingreso', icono: '💵', color: '#607D8B', descripcion: 'Otros ingresos varios' },

    // Categorías de Gastos
    { nombre: 'Alimentación', tipo: 'gasto', icono: '🍔', color: '#FF5252', descripcion: 'Supermercado y comidas' },
    { nombre: 'Transporte', tipo: 'gasto', icono: '🚗', color: '#448AFF', descripcion: 'Transporte público, gasolina, taxi' },
    { nombre: 'Vivienda', tipo: 'gasto', icono: '🏡', color: '#B0BEC5', descripcion: 'Alquiler, hipoteca, servicios' },
    { nombre: 'Servicios Públicos', tipo: 'gasto', icono: '💡', color: '#FFEB3B', descripcion: 'Agua, luz, gas, internet' },
    { nombre: 'Entretenimiento', tipo: 'gasto', icono: '🎮', color: '#E91E63', descripcion: 'Cine, streaming, juegos' },
    { nombre: 'Salud', tipo: 'gasto', icono: '⚕️', color: '#4CAF50', descripcion: 'Médico, medicinas, seguros' },
    { nombre: 'Educación', tipo: 'gasto', icono: '📚', color: '#3F51B5', descripcion: 'Cursos, libros, matrícula' },
    { nombre: 'Ropa', tipo: 'gasto', icono: '👔', color: '#9C27B0', descripcion: 'Vestimenta y calzado' },
    { nombre: 'Restaurantes', tipo: 'gasto', icono: '🍽️', color: '#FF6F00', descripcion: 'Comidas fuera de casa' },
    { nombre: 'Compras', tipo: 'gasto', icono: '🛒', color: '#00BCD4', descripcion: 'Compras varias' },
    { nombre: 'Deudas', tipo: 'gasto', icono: '💳', color: '#F44336', descripcion: 'Pagos de préstamos y tarjetas' },
    { nombre: 'Ahorros', tipo: 'gasto', icono: '🏦', color: '#4CAF50', descripcion: 'Ahorros y inversiones' },
    { nombre: 'Mascotas', tipo: 'gasto', icono: '🐕', color: '#FF9800', descripcion: 'Cuidado de mascotas' },
    { nombre: 'Regalos', tipo: 'gasto', icono: '🎁', color: '#E91E63', descripcion: 'Regalos y obsequios' },
    { nombre: 'Viajes', tipo: 'gasto', icono: '✈️', color: '#2196F3', descripcion: 'Viajes y vacaciones' },
    { nombre: 'Gimnasio', tipo: 'gasto', icono: '💪', color: '#FF5722', descripcion: 'Gimnasio y deportes' },
    { nombre: 'Suscripciones', tipo: 'gasto', icono: '📱', color: '#673AB7', descripcion: 'Suscripciones digitales' },
    { nombre: 'Seguros', tipo: 'gasto', icono: '🛡️', color: '#009688', descripcion: 'Seguros varios' },
    { nombre: 'Impuestos', tipo: 'gasto', icono: '📋', color: '#795548', descripcion: 'Impuestos y tasas' },
    { nombre: 'Otros Gastos', tipo: 'gasto', icono: '💸', color: '#9E9E9E', descripcion: 'Otros gastos varios' },
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { id: 0 }, // Siempre crea nuevo porque id 0 no existe
      update: {},
      create: categoria,
    });
  }

  console.log(`✅ ${categorias.length} categorías creadas`);

  // Seed de Tipos de Pago
  console.log('💳 Creando tipos de pago...');
  
  const tiposPago = [
    { nombre: 'Efectivo', descripcion: 'Pago en efectivo' },
    { nombre: 'Débito', descripcion: 'Tarjeta de débito' },
    { nombre: 'Crédito', descripcion: 'Tarjeta de crédito' },
    { nombre: 'Transferencia', descripcion: 'Transferencia bancaria' },
    { nombre: 'PayPal', descripcion: 'Pago por PayPal' },
    { nombre: 'Billetera Digital', descripcion: 'Nequi, Daviplata, etc.' },
    { nombre: 'Cheque', descripcion: 'Pago con cheque' },
    { nombre: 'Criptomonedas', descripcion: 'Pago con criptomonedas' },
  ];

  for (const tipoPago of tiposPago) {
    await prisma.tipoPago.upsert({
      where: { nombre: tipoPago.nombre },
      update: {},
      create: tipoPago,
    });
  }

  console.log(`✅ ${tiposPago.length} tipos de pago creados`);

  // Seed de Frecuencias
  console.log('📅 Creando frecuencias...');
  
  const frecuencias = [
    { nombre: 'Diario', dias: 1, descripcion: 'Se repite cada día' },
    { nombre: 'Semanal', dias: 7, descripcion: 'Se repite cada semana' },
    { nombre: 'Quincenal', dias: 15, descripcion: 'Se repite cada quince días' },
    { nombre: 'Mensual', dias: 30, descripcion: 'Se repite cada mes' },
    { nombre: 'Bimestral', dias: 60, descripcion: 'Se repite cada dos meses' },
    { nombre: 'Trimestral', dias: 90, descripcion: 'Se repite cada tres meses' },
    { nombre: 'Semestral', dias: 180, descripcion: 'Se repite cada seis meses' },
    { nombre: 'Anual', dias: 365, descripcion: 'Se repite cada año' },
  ];

  for (const frecuencia of frecuencias) {
    await prisma.frecuencia.upsert({
      where: { nombre: frecuencia.nombre },
      update: {},
      create: frecuencia,
    });
  }

  console.log(`✅ ${frecuencias.length} frecuencias creadas`);

  console.log('✨ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

