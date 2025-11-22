import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail', // Default to gmail, but can be configured
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
