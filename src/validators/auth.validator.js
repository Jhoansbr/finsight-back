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
  
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
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

