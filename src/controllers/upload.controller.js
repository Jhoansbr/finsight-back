import { uploadService } from '../services/upload.service.js';
import { successResponse } from '../utils/response.js';

export const uploadController = {
    /**
     * Subir foto de perfil
     * POST /api/v1/users/upload-photo
     */
    async uploadProfilePhoto(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'No se recibió ninguna imagen',
                    },
                });
            }

            const result = await uploadService.uploadProfilePhoto(req.file, req.user.id);

            res.json(successResponse({
                url: result.url,
                message: 'Foto subida exitosamente',
            }));
        } catch (error) {
            next(error);
        }
    },
};
