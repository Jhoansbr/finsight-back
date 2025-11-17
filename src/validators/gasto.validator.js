import { body, query } from 'express-validator';

export const createGastoValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 200 })
    .withMessage('El nombre no debe exceder 200 caracteres'),
  
  body('categoriaId')
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido'),
  
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('fecha')
    .isISO8601()
    .withMessage('Fecha inválida')
    .toDate(),
  
  body('tipoPagoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de tipo de pago inválido'),
  
  body('esRecurrente')
    .optional()
    .isBoolean()
    .withMessage('esRecurrente debe ser booleano'),
  
  body('frecuenciaId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de frecuencia inválido'),
  
  body('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida')
    .toDate(),
  
  body('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida')
    .toDate(),
];

export const updateGastoValidator = [
  body('categoriaId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido'),
  
  body('monto')
    .optional()
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
  
  body('tipoPagoId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de tipo de pago inválido'),
  
  body('esRecurrente')
    .optional()
    .isBoolean()
    .withMessage('esRecurrente debe ser booleano'),
  
  body('frecuenciaId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de frecuencia inválido'),
  
  body('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida')
    .toDate(),
  
  body('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida')
    .toDate(),
];

export const listGastosValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  
  query('fechaInicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),
  
  query('fechaFin')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida'),
  
  query('categoriaId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido'),
  
  query('esRecurrente')
    .optional()
    .isBoolean()
    .withMessage('esRecurrente debe ser booleano'),
];

