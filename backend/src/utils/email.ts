import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email using nodemailer
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    // Skip email sending if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('📧 Email would be sent to:', options.to);
      console.log('📧 Subject:', options.subject);
      console.log('📧 Content:', options.text || options.html);
      return true;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('✅ Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">PeakTech</h1>
          <p style="margin: 10px 0 0 0;">Verify Your Email</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for registering with PeakTech. Please use the following OTP to verify your email address:</p>
          <div class="otp">${otp}</div>
          <p style="text-align: center; color: #666;">This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PeakTech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - PeakTech',
    html,
    text: `Your PeakTech verification code is: ${otp}. This code will expire in 10 minutes.`,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Welcome to PeakTech!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Welcome to PeakTech! We're excited to have you on board.</p>
          <p>You can now explore our wide range of products and enjoy a seamless shopping experience.</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" class="button">Start Shopping</a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy shopping!</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PeakTech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to PeakTech!',
    html,
    text: `Hi ${name}, Welcome to PeakTech! We're excited to have you on board.`,
  });
}
