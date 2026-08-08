// const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // const emailUser = process.env.EMAIL_USER?.trim();
    // const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '').trim();

    // this.transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: emailUser,
    //     pass: emailPass,
    //   },
    //   connectionTimeout: 10000,
    //   greetingTimeout: 10000,
    //   socketTimeout: 10000,
    // });
  }

  async send(data) {
    if (!data?.recipient || !data?.otp) {
      throw new Error('EMAIL service requires recipient and otp');
    }

    // const mailOptions = {
    //   from: process.env.EMAIL_USER?.trim(),
    //   to: data.recipient,
    //   subject: 'Your OTP Code',
    //   text: `Your OTP code is ${data.otp}. It is valid for 10 minutes. Do not share it with anyone.`,
    //   html: `
    //     <p>Your OTP code is <strong>${data.otp}</strong>.</p>
    //     <p>This code is valid for 10 minutes.</p>
    //     <p>Please do not share it with anyone.</p>
    //   `,
    // };

    // try {
    //   const info = await this.transporter.sendMail(mailOptions);
    //   console.log(`📧 [EMAIL SENT] OTP ${data.otp} sent to ${data.recipient}. MessageId: ${info.messageId}`);
    //   return info;
    // } catch (error) {
    //   const detail = error.response || error.message || 'Unknown SMTP error';
    //   console.error('❌ SMTP Error:', detail);
    //   throw new Error(`Failed to send OTP email: ${detail}`);
    // }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY, // Render environment variable से API Key
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'VyaparAI',
            email: process.env.SENDER_EMAIL // आपकी रजिस्टर्ड Gmail ID (जैसे: vishwadeepakp.pandey@gmail.com)
          },
          to: [
            {
              email: data.recipient// जिस यूज़र को OTP भेजना है (किसी भी रैंडम ईमेल पर काम करेगा)
            }
          ],
          subject: 'Your OTP Verification Code',
          htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>OTP Verification</h2>
            <p>Your OTP code is: <strong style="font-size: 20px; color: #4CAF50;">${data.otp}</strong></p>
            <p>This code is valid for 10 minutes. Please do not share it with anyone.</p>
          </div>
        `,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(`Brevo API Error: ${JSON.stringify(data)}`);
      }

      console.log('✅ Email sent successfully via Brevo API! Message ID:', res.messageId);
      return res;
    } catch (error) {
      console.error('❌ Failed to send email via Brevo:', error.message);
      throw error;
    }
  }
}

module.exports = EmailService;