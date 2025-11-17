import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash de contraseña
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Comparar contraseña con hash
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

