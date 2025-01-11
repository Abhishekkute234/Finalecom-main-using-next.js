// lib/mail.ts
import nodemailer from "nodemailer";

export async function sendVerificationEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "ImagingGifts <your_email@gmail.com>",
    to,
    subject: "Verify Your Email - ImagingGifts",
    text: `Verify your email by clicking the link: ${process.env.NEXT_PUBLIC_VERIFY_URL}/verify?token=${token}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #007bff; font-size: 24px; margin: 0;">ImagingGifts</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Hello,</h2>
          <p style="margin: 0 0 10px;">Thank you for signing up with ImagingGifts! Please verify your email address to activate your account.</p>
          <p style="margin: 0 0 20px;">Click the button below to complete your registration:</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_VERIFY_URL}/verify?token=${token}"
              style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          <p style="margin: 20px 0 10px; font-size: 14px; color: #666;">Or, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 14px; color: #007bff;">
            ${process.env.NEXT_PUBLIC_VERIFY_URL}/verify?token=${token}
          </p>
        </div>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">If you did not create an account, please ignore this email.</p>
          <p style="margin: 0;">&copy; 2025 ImagingGifts. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
