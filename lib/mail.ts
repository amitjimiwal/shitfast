import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface Response {
     success: boolean;
     error?: string;
     response: SMTPTransport.SentMessageInfo
}
export default async function sendMail({
     to,
     subject,
     html,
}: {
     to: string;
     subject: string;
     html: string;
}): Promise<Response> {
     const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
     if (!SMTP_EMAIL || !SMTP_PASSWORD) {
          throw new Error('SMTP_EMAIL or SMTP_PASSWORD is not defined');
     }
     const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 485,
          secure: true,
          auth: {
               user: SMTP_EMAIL,
               pass: SMTP_PASSWORD,
          }
     });

     try {
          const testVerify = await transporter.verify();
          console.log('SMTP connection verified:', testVerify);
     } catch (err) {
          console.log('Error verifying SMTP connection:', err);
     }

     try {
          const info = await transporter.sendMail({
               from: SMTP_EMAIL,
               to,
               subject,
               html,
          });

          console.log('Message sent: %s', info.messageId);
          return {
               success: true,
               response: info,
          };
     } catch (error) {
          console.error('Error sending email:', error);
          return {
               success: false,
               error: 'Failed to send email',
               response: error as SMTPTransport.SentMessageInfo,
          };
     }
}