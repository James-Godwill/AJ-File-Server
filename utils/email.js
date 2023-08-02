const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: 'c53bffec5c4384',
      pass: '4bacad2566e985',
    },
  });
  //Define the email options

  let emailOptions;

  if (options.filename) {
    const folderPath = './public/uploads';

    emailOptions = {
      from: 'AJ File Server <james.arkoh@amalitech.org>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: '<h1>Regards </h1>< p >From Lizzy Store </p>',
      attachments: [
        {
          filename: options.filename,
          path: `${folderPath}/${options.filename}`,
          cid: `uniq-${options.filename}`,
        },
      ],
    };
  } else {
    emailOptions = {
      from: 'AJ File Server <james.arkoh@amalitech.org>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  }

  //Send email with nodemailer
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
