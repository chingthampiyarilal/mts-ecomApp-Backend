const nodemailer = require("nodemailer");
// const imageFilePath = require("../config/gmail.jpg")


const sendEmail = async (toEmails,subject, body, imageFilePath ) => {  

    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'khumanchingtham123@gmail.com',
              pass: 'xiag znjj gzon zzcp'
            }
          });
          
          const mailOptions = {
            from: 'khumanchingtham123@gmail.com',
            to: toEmails,
            subject: subject,
            html: body,
            attachments: [
                {
                    filename: 'gmail.jpg',
                    path: imageFilePath,
                    cid: 'uniqueCID'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
        throw new Error(`Error sending email: ${error.message}`);
    }
};



module.exports = sendEmail;