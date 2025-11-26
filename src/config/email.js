import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verificar conexión
transporter.verify().then(() => {
    console.log('Listo para enviar correos');
}).catch((error) => {
    console.error('Error en configuración de correo:', error);
});
