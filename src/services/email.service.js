import { transporter } from '../config/email.js';

export const emailService = {
  /**
   * Enviar correo de recuperación de contraseña
   */
  async sendPasswordResetEmail(email, token) {
    // En producción, esto debería ser la URL de tu frontend
    // Por ahora, usaremos un link genérico o deep link si es app móvil
    const resetLink = `https://finsight-app.com/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Finsight Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - Finsight',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña en Finsight.</p>
          <p>Usa el siguiente código o token para completar el proceso:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <code style="font-size: 18px; color: #e74c3c; word-break: break-all;">${token}</code>
          </div>

          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste esto, puedes ignorar este correo.</p>
          <hr>
          <p style="font-size: 12px; color: #7f8c8d;">Este es un correo automático, por favor no respondas.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};
