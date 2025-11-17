import { body, query } from 'express-validator';

export const createMetaAhorroValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 200 })
    .withMessage('El nombre no debe exceder 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('montoObjetivo')
    .isFloat({ min: 0.01 })
    .withMessage('El monto objetivo debe ser un número positivo'),
  
  body('fechaInicio')
    .isISO8601()
    .withMessage('Fecha de inicio inválida')
    .toDate(),
  
  body('fechaObjetivo')
    .optional()
    .isISO8601()
    .withMessage('Fecha objetivo inválida')
    .toDate(),
  
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad debe ser: baja, media o alta'),
  
  body('icono')
    .optional()
    .isString()
    .withMessage('Icono inválido'),
];

export const updateMetaAhorroValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('El nombre no debe exceder 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('montoObjetivo')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto objetivo debe ser un número positivo'),
  
  body('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida')
    .toDate(),
  
  body('fechaObjetivo')
    .optional()
    .isISO8601()
    .withMessage('Fecha objetivo inválida')
    .toDate(),
  
  body('estado')
    .optional()
    .isIn(['en_progreso', 'completada', 'cancelada'])
    .withMessage('Estado debe ser: en_progreso, completada o cancelada'),
  
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad debe ser: baja, media o alta'),
  
  body('icono')
    .optional()
    .isString()
    .withMessage('Icono inválido'),
];

export const createMovimientoValidator = [
  body('tipoMovimiento')
    .isIn(['deposito', 'retiro'])
    .withMessage('Tipo de movimiento debe ser: deposito o retiro'),
  
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('Fecha inválida')
    .toDate(),
];

export const listMetasAhorroValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  
  query('estado')
    .optional()
    .isIn(['en_progreso', 'completada', 'cancelada'])
    .withMessage('Estado debe ser: en_progreso, completada o cancelada'),
  
  query('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad debe ser: baja, media o alta'),
];

