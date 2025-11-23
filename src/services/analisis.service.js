import prismaSecondary from '../config/secondaryDatabase.js';

export const analisisService = {
    /**
     * Obtener el resultado del análisis del día para un usuario
     */
    async getAnalisisDiario(userId) {
        // Obtener fecha actual en formato YYYY-MM-DD para comparar con campo Date de BD
        const hoy = new Date();
        const fechaString = hoy.toISOString().split('T')[0];
        const fechaDate = new Date(fechaString);

        const analisis = await prismaSecondary.resultadosAnalisis.findFirst({
            where: {
                idUsuario: userId,
                fecha: fechaDate,
            },
        });

        return analisis;
    }
};
