const nodemailer = require("nodemailer");

/**
 * Send email using Gmail or any SMTP service.
 * @param {String} senderEmail - Sender email address
 * @param {String} password - App password (not normal Gmail password)
 * @param {String} clientEmail - Recipient email
 * @param {String} emailSubject - Subject line
 * @param {String} emailData - Message content (HTML or plain text)
 */
exports.emailSender = async function (
  senderEmail,
  password,
  clientEmail,
  emailSubject,
  emailData
) {
  try {
    //  Create transporter (use App Password for Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    //  Mail content
    const mailOptions = {
      from: `StreakNest <${senderEmail}>`,
      to: clientEmail,
      subject: emailSubject,
      text: emailData, // plain text fallback
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #4CAF50;">StreakNest Password Reset</h2>
          <p>Hello 👋,</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <p>
            <a href="${emailData}" 
               style="background-color:#4CAF50;color:#fff;padding:10px 20px;
                      text-decoration:none;border-radius:5px;">Reset Password</a>
          </p>
          <p><b>Note:</b> This link expires in 5 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    //  Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(` Email sent successfully to ${clientEmail}: ${info.response}`);
    return true;
  } catch (error) {
    console.error(" Email sending failed:", error.message);
    return false;
  }
};





// const nodemailer=require('nodemailer');

// exports.emailSender = async function(senderEmail,password,clientEmail,emailSubject,emailData){
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: senderEmail,
//           pass: password
//         }
//       });
      
//       var mailOptions = {
//         from: senderEmail,
//         to: clientEmail,
//         subject: emailSubject,
//         text: emailData
//       };
      
//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           // console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
// }

