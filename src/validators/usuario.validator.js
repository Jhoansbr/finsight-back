import { body } from 'express-validator';

export const updateProfileValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),

  body('apodo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El apodo no debe exceder 100 caracteres'),

  body('fotoPerfil')
    .optional()
    .trim(),

  body('telegram')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El usuario de Telegram no debe exceder 100 caracteres'),

  body('whatsapp')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Número de WhatsApp inválido')
    .isLength({ max: 20 })
    .withMessage('El número de WhatsApp no debe exceder 20 caracteres'),
];

export const updatePreferencesValidator = [
  body('moneda')
    .optional()
    .isLength({ min: 3, max: 10 })
    .withMessage('Código de moneda debe tener entre 3 y 10 caracteres'),

  body('pais')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El país no debe exceder 100 caracteres'),

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
