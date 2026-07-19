import nodemailer from 'nodemailer'

const sendMail = async (email, subject, message) => {
  try {
    // If Resend API Key is configured, use HTTP API (required for Render Free Tier)
    if (process.env.RESEND_API_KEY) {
      console.log(`Sending email via Resend API to ${email}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || 'onboarding@resend.dev',
          to: email,
          subject: subject,
          html: message
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`Email successfully sent via Resend API to ${email}`);
        return;
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    }

    // Fallback: SMTP via Nodemailer (useful for local development)
    console.log(`Sending email via SMTP to ${email}...`);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password mapping
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

export default sendMail;