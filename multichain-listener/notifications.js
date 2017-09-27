const nodemailer = require('nodemailer');

const sendEmail = (to, emailBodyPlainText) => {
    return new Promise((resolve, reject) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'mail.persistent.co.in',
        port: 587,
        auth: {
          user: process.env.adminEmail,
          pass: process.env.adminPassword
        }
      });
  
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"MediCare" <' + process.env.adminEmail + '>', // sender address
        to: to, // list of receivers
        subject: 'MediCare Alert: Medicine Recall!', // Subject line
        text: emailBodyPlainText, // plain text body
      };
  
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log("Email sent!");
        return resolve(true);
      });
    });
  };

  module.exports = { sendEmail }