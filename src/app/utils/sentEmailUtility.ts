import axios from "axios";
import config from "../../config";

const sentEmailUtility = async (
  emailTo: string,
  EmailSubject: string,
  EmailHTML?: string,
  EmailText?: string
) => {
  try {
    if (!EmailHTML && !EmailText) {
      EmailText = "This is a default email content.";
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Md Abdul Kyum",
          email: config.emailSender.email,
        },
        to: [{ email: emailTo }],
        subject: EmailSubject,
        htmlContent: EmailHTML || EmailText,
        textContent: EmailText || EmailHTML,
      },
      {
        headers: {
          "api-key": config.emailSender.app_pass,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "💥 Brevo Email API Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email using Brevo API");
  }
};

export default sentEmailUtility;






















// import config from "../../config";


// const nodemailer = require("nodemailer");
// const smtpTransporter = require("nodemailer-smtp-transport");

// let sentEmailUtility = async (
//   emailTo: string,
//   EmailSubject: string,
//   EmailHTML?: string, 
//   EmailText?: string,
// ) => {
//   let transporter = nodemailer.createTransport(
//     smtpTransporter({
//       host: "smtp.gmail.com",
//       secure: true,
//       port: 465,
//       auth: {
//         user: config.emailSender.email,
//         pass: config.emailSender.app_pass,

//       },
//       tls: {
//         rejectUnauthorized: false, 
//       },
//     })
//   );

//   let mailOption = {
//     from: config.emailSender.email,
//     to: emailTo,
//     subject: EmailSubject,
//     text: EmailText,
//     html: EmailHTML,
//   };

//   return await transporter.sendMail(mailOption);
// };

// export default sentEmailUtility;




