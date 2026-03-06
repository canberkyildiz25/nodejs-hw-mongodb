import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT', '587')),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const renderTemplate = async (templateName, context) => {
  const templatePath = path.join(templatesDir, `${templateName}.hbs`);
  const source = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(source);
  return template(context);
};

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: env('SMTP_FROM'),
    to,
    subject,
    html,
  });
};
