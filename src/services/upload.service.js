import cloudinary from '../config/cloudinary.js';
import { ValidationError } from '../utils/errors.js';

export const uploadService = {
    /**
     * Subir foto de perfil a Cloudinary
     */
    async uploadProfilePhoto(file, userId) {
        // Validar tipo de archivo
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedFormats.includes(file.mimetype)) {
            throw new ValidationError('Formato de imagen no válido. Usa JPG, PNG o WEBP');
        }

        // Validar tamaño (5MB máximo)
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
            throw new ValidationError('La imagen no debe superar 5MB');
        }

        try {
            // Convertir buffer a base64
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;

            // Subir a Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: `profile-photos/${userId}`,
                public_id: `avatar-${Date.now()}`,
                transformation: [
                    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            });

            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        } catch (error) {
            throw new Error(`Error al subir imagen: ${error.message}`);
        }
    },

    /**
     * Eliminar foto anterior de Cloudinary
     */
    async deletePhoto(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            // No lanzar error si falla, solo log
            console.error('Error al eliminar foto anterior:', error.message);
        }
    },
};
