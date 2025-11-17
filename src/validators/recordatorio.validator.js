import { body, query } from 'express-validator';

export const createRecordatorioValidator = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 200 })
    .withMessage('El título no debe exceder 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('fecha')
    .isISO8601()
    .withMessage('Fecha inválida')
    .toDate(),
  
  body('tipo')
    .isIn(['pago', 'meta', 'presupuesto', 'personalizado'])
    .withMessage('Tipo debe ser: pago, meta, presupuesto o personalizado'),
];

export const updateRecordatorioValidator = [
  body('titulo')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('El título no debe exceder 200 caracteres'),
  
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
  
  body('tipo')
    .optional()
    .isIn(['pago', 'meta', 'presupuesto', 'personalizado'])
    .withMessage('Tipo debe ser: pago, meta, presupuesto o personalizado'),
  
  body('completado')
    .optional()
    .isBoolean()
    .withMessage('completado debe ser booleano'),
];

export const listRecordatoriosValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  
  query('completado')
    .optional()
    .isBoolean()
    .withMessage('completado debe ser booleano'),
  
  query('tipo')
    .optional()
    .isIn(['pago', 'meta', 'presupuesto', 'personalizado'])
    .withMessage('Tipo debe ser: pago, meta, presupuesto o personalizado'),
];

