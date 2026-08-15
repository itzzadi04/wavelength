require('dotenv').config()

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.GMAIL_USER; 

const sendVerificationEmail = async (to, code) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Chat App', email: SENDER_EMAIL },
        to: [{ email: to }],
        subject: 'Your verification code to register for wavelength',
        htmlContent: `
          <div style="font-family: sans-serif;">
            <h1>Thanks for choosing wavelength</h1>
            <h2>Verify your email</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 4px;">${code}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Brevo API error (${response.status}): ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Failed to send verification email:', err);
    throw err;
  }
};

module.exports = { sendVerificationEmail };
