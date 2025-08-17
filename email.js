const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // or your SMTP host
  port: 465, // SSL port
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

async function sendSummary(emails, summary, message = '') {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(','),
    subject: 'Meeting Summary',
    text: `${message}\n\n${summary}`,
    html: `<p>${message.replace(/\n/g, '<br>')}</p><hr><div>${summary.replace(/\n/g, '<br>')}</div>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

module.exports = { sendSummary };