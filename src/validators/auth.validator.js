import { body } from 'express-validator';

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no debe exceder 100 caracteres'),
  
  body('apodo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El apodo no debe exceder 100 caracteres'),
  
  body('telegram')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El telegram no debe exceder 100 caracteres'),
  
  body('whatsapp')
    .optional()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('WhatsApp inválido')
    .isLength({ max: 20 })
    .withMessage('WhatsApp no debe exceder 20 caracteres'),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token es requerido'),
];

