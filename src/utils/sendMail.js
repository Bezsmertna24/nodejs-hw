import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT == 587, // TLS для 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
        });
    } catch (error) {
        throw new Error("Failed to send email");
    }
};
