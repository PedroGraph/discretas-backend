import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL_NODEMAILER,
        pass: process.env.PASS_EMAIL_NODEMAILER,
    },
});

export const sendPasswordRecoveryEmail = async (data) => {
    try {
        const options = {
            from: process.env.USER_EMAIL_NODEMAILER,
            to: data.email,
            subject: `Password Recovery - ${data.firstName} ${data.lastName}`,
            html: `<p>Hi ${data.firstName} ${data.lastName},</p><p> Your password recovery code is: ${data.resetToken}</p>`,
        };
        const response = await transporter.sendMail(options);
        return response;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo');
    }
};
