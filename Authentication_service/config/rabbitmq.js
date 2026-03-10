import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_URL = "amqp://admin:admin123@localhost:5672";
const QUEUE_NAME = 'login_emails';

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT, // e.g., 587 or 465
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

let channel = null;

export const connectRabbitMQ = async () => {
    try {
        const urlToUse = RABBITMQ_URL.includes('@') ? RABBITMQ_URL : 'amqp://guest:guest@127.0.0.1:5672';
        console.log(`[RabbitMQ] Attempting to connect to ${urlToUse}...`);
        const connection = await amqp.connect(urlToUse);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`Connected to RabbitMQ, queue: ${QUEUE_NAME} ready`);
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        // Attempt to reconnect after a delay in a real-world scenario
    }
};

export const publishLoginEvent = async (email, name) => {
    if (!channel) {
        console.error('RabbitMQ channel not established, cannot publish message');
        return;
    }
    const message = JSON.stringify({ email, name, timestamp: new Date() });
    try {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
        console.log(`[RabbitMQ] Sent login event for ${email}`);
    } catch (error) {
        console.error('[RabbitMQ] Error publishing to queue:', error);
    }
};

export const consumeLoginEvents = async () => {
    if (!channel) {
        console.error('RabbitMQ channel not established, cannot consume');
        return;
    }
    console.log(`[RabbitMQ] Waiting for messages in in ${QUEUE_NAME}. To exit press CTRL+C`);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log(`[RabbitMQ] Received login event:`, data);

                const mailOptions = {
                    from: `"Job Scheduling App" <${process.env.SMTP_USER}>`,
                    to: data.email,
                    subject: 'New Login Alert',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                            <h2 style="color: #333;">Login Successful!</h2>
                            <p style="color: #555;">Hello <strong>${data.name}</strong>,</p>
                            <p style="color: #555;">We detected a new login to your account on our platform at ${new Date(data.timestamp).toLocaleString()}.</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF; margin: 20px 0;">
                                <strong>Important:</strong> If this wasn't you, please secure your account immediately.
                            </div>
                            <p style="color: #555;">Best Regards,</p>
                            <p style="color: #555; font-weight: bold;">The Job Scheduling Team</p>
                        </div>
                    `,
                };

                // Only attempt to send if SMTP is configured to avoid crashes
                if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                    await transporter.sendMail(mailOptions);
                    console.log(`[Nodemailer] Email sent successfully to ${data.email}`);
                } else {
                    console.log(`[Nodemailer] Email skipped for ${data.email} as SMTP credentials are missing.`);
                }

                channel.ack(msg); // Acknowledge message after processing
            } catch (error) {
                console.error('[RabbitMQ] Error processing message:', error);
                // In a robust system, you might nack or dead-letter the message here
            }
        }
    });
};
