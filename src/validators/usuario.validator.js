import { body } from 'express-validator';

export const updateProfileValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),
  
  body('apellido')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El apellido no debe exceder 100 caracteres'),
  
  body('fechaNacimiento')
    .optional()
    .isISO8601()
    .withMessage('Fecha de nacimiento inválida')
    .toDate(),
  
  body('telefono')
    .optional()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Teléfono inválido'),
];

export const updatePreferencesValidator = [
  body('moneda')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Código de moneda debe tener 3 caracteres')
    .isUppercase()
    .withMessage('Código de moneda debe estar en mayúsculas'),
  
  body('zonaHoraria')
    .optional()
    .isString()
    .withMessage('Zona horaria inválida'),
  
  body('idioma')
    .optional()
    .isIn(['es', 'en', 'pt'])
    .withMessage('Idioma no soportado'),
  
  body('notificacionesEmail')
    .optional()
    .isBoolean()
    .withMessage('notificacionesEmail debe ser booleano'),
  
  body('notificacionesPush')
    .optional()
    .isBoolean()
    .withMessage('notificacionesPush debe ser booleano'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
];

