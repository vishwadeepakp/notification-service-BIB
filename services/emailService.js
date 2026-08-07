const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '').trim();

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // 👈 Explicit Host
      port: 465,               // 👈 Port 465 (SSL) - Render पर कभी ब्लॉक नहीं होता!
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      }
    });
  }

  async send(data) {
    if (!data?.recipient || !data?.otp) {
      throw new Error('EMAIL service requires recipient and otp');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER?.trim(),
      to: data.recipient,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${data.otp}. It is valid for 10 minutes. Do not share it with anyone.`,
      html: `
        <p>Your OTP code is <strong>${data.otp}</strong>.</p>
        <p>This code is valid for 10 minutes.</p>
        <p>Please do not share it with anyone.</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 [EMAIL SENT] OTP ${data.otp} sent to ${data.recipient}. MessageId: ${info.messageId}`);
      return info;
    } catch (error) {
      const detail = error.response || error.message || 'Unknown SMTP error';
      console.error('❌ SMTP Error:', detail);
      throw new Error(`Failed to send OTP email: ${detail}`);
    }
  }
}

module.exports = EmailService;