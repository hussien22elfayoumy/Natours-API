import nodemailer from 'nodemailer';
import pug from 'pug';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { convert } from 'html-to-text';

const _fileName = fileURLToPath(import.meta.url);
const _dirname = dirname(_fileName);

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Hussien Mohammed <${process.env.EMAIL_FROM}>`;
  }

  // 1) Create a transporter
  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // use Sandgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // 2) Send actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template (generate)
    const html = pug.renderFile(`${_dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      subject: this.subject,
      url: this.url,
    });

    // 2) define the mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransporter().sendMail(mailOptions);
  }

  // 3) Custom email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natuors family.');
  }
}
