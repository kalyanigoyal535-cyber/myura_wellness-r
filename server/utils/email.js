import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter configuration error:", error.message);
    if (error.message.includes('535')) {
      console.warn("💡 Tip: For Gmail, ensure you are using an 'App Password' if 2FA is enabled.");
    }
    console.warn(
      "⚠️  Email sending will be disabled. Please configure SMTP settings in .env"
    );
  } else {
    console.log("✅ Email transporter configured successfully");
  }
});

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetLink - Password reset link
 * @param {string} userName - User's name (optional)
 * @returns {Promise<boolean>}
 */
export const sendPasswordResetEmail = async (
  email,
  resetLink,
  userName = null
) => {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("⚠️  SMTP not configured. Password reset link:", resetLink);
      return false;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "MYURA Wellness"}" <${
        process.env.SMTP_USER
      }>`,
      to: email,
      subject: "Password Reset Request - MYURA Wellness",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">MYURA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Wellness That Radiates From Within</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hello${userName ? ` ${userName}` : ""},</p>
            
            <p>We received a request to reset your password for your MYURA Wellness account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 40px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
            </p>
            
            <p style="font-size: 14px; color: #666;">
              <strong>This link will expire in 1 hour.</strong>
            </p>
            
            <p style="font-size: 14px; color: #666;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} MYURA Wellness. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - MYURA Wellness
        
        Hello${userName ? ` ${userName}` : ""},
        
        We received a request to reset your password for your MYURA Wellness account.
        
        Click the link below to reset your password:
        ${resetLink}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        
        © ${new Date().getFullYear()} MYURA Wellness. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return false;
  }
};

/**
 * Send welcome email (optional)
 */
export const sendWelcomeEmail = async (email, userName = null) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return false;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "MYURA Wellness"}" <${
        process.env.SMTP_USER
      }>`,
      to: email,
      subject: "Welcome to MYURA Wellness",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">MYURA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Wellness That Radiates From Within</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Welcome to MYURA Wellness!</h2>
            
            <p>Hello${userName ? ` ${userName}` : ""},</p>
            
            <p>Thank you for joining MYURA Wellness. We're excited to have you on board!</p>
            
            <p>Start your wellness journey with us and discover products that radiate from within.</p>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 30px 0 0 0;">
              © ${new Date().getFullYear()} MYURA Wellness. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - The OTP code
 * @param {string} userName - User's name (optional)
 * @returns {Promise<boolean>}
 */
export const sendOTPEmail = async (email, otp, userName = null) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("⚠️  SMTP not configured. OTP for", email, "is:", otp);
      return false;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || "MYURA Wellness"}" <${
        process.env.SMTP_USER
      }>`,
      to: email,
      subject: "Verification Code - MYURA Wellness",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #162031 0%, #2c3e50 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">MYURA</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Wellness That Radiates From Within</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0; text-align: center;">Verify Your Email</h2>
            
            <p>Hello${userName ? ` ${userName}` : ""},</p>
            
            <p>Thank you for choosing MYURA Wellness. Use the following code to verify your email address. This code is valid for <strong>10 minutes</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #fff; border: 2px dashed #162031; color: #162031; 
                          padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
                ${otp}
              </div>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} MYURA Wellness. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Verify Your Email - MYURA Wellness
        
        Hello${userName ? ` ${userName}` : ""},
        
        Your verification code is: ${otp}
        
        This code is valid for 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        © ${new Date().getFullYear()} MYURA Wellness. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return false;
  }
};