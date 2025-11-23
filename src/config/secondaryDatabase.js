import { PrismaClient } from '@prisma/secondary-client';
import logger from './logger.js';

const prismaSecondary = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

prismaSecondary.$on('error', (e) => {
    logger.error(`Secondary Database Error: ${e.message}`);
});

prismaSecondary.$on('warn', (e) => {
    logger.warn(`Secondary Database Warning: ${e.message}`);
});

export default prismaSecondary;
