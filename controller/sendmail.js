const nodemailer = require(`nodemailer`);
require('dotenv').config() 
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

transporter.verify()
  .then(() => console.log('Mailer ready'))
  .catch((err) => console.error('Mailer setup failed:', err));


const sendVerificationEmail = async (to, code) => {
  try {
    await transporter.sendMail({
      from: `"Chat App" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Your verification code to register for wavelength',
      html: `
        <div style="font-family: sans-serif;">
          <h1> thanks for choosing wavelength <h1>
          <h2>Verify your email</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Failed to send verification email   :', err);
    throw err; 
  }
};

module.exports = { sendVerificationEmail };