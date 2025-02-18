// backend/utils/emailSender.js (Example using Nodemailer)
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter (configure with your email provider's settings)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
      port: process.env.EMAIL_PORT, // e.g., 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      // html:  (for HTML emails)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };