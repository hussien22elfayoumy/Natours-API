import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define the email options
  const mailOptions = {
    from: 'Hussien MOhammed <admin@email.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 3) send the actual email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
