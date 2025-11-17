import { body, query } from 'express-validator';

export const createPresupuestoValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 200 })
    .withMessage('El nombre no debe exceder 200 caracteres'),
  
  body('mes')
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe estar entre 1 y 12'),
  
  body('anio')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('El año debe estar entre 2000 y 2100'),
  
  body('montoTotal')
    .isFloat({ min: 0.01 })
    .withMessage('El monto total debe ser un número positivo'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
];

export const updatePresupuestoValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('El nombre no debe exceder 200 caracteres'),
  
  body('montoTotal')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto total debe ser un número positivo'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no debe exceder 1000 caracteres'),
];

export const assignCategoriaValidator = [
  body('categoriaId')
    .isInt({ min: 1 })
    .withMessage('ID de categoría inválido'),
  
  body('montoAsignado')
    .isFloat({ min: 0.01 })
    .withMessage('El monto asignado debe ser un número positivo'),
];

export const listPresupuestosValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  
  query('mes')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe estar entre 1 y 12'),
  
  query('anio')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('El año debe estar entre 2000 y 2100'),
];

