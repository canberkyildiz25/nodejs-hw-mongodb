import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT', '587')),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: env('SMTP_FROM'),
    to,
    subject,
    html,
  });
};
