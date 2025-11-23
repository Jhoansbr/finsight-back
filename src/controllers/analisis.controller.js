import { analisisService } from '../services/analisis.service.js';

export const analisisController = {
    async getAnalisisDiario(req, res, next) {
        try {
            const userId = req.user.id;
            const analisis = await analisisService.getAnalisisDiario(userId);

            res.json({
                success: true,
                data: analisis || null, // Devuelve null si no hay análisis hoy
                message: analisis ? 'Análisis encontrado' : 'No hay análisis para el día de hoy'
            });
        } catch (error) {
            next(error);
        }
    }
};
