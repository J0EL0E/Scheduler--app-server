const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmailActivation = (email, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    const emailMessage = transporter.sendMail({
            from: {
                name: "Scheduler App Team",
                address: process.env.USER
            }, 
            to:  [ email, ], 
            subject: "Activation Link", 
            text: "To activate your account navigate to the link",
            html: `<h1>
            To activate your account navigate to the <a href=${link}>link</a>
            </h1>
            `, 
    });
    

    transporter.sendMail(emailMessage, (err, info) => {
                if(err) console.log(err)
                else{
                console.log(info)
                }
    });
    
}

module.exports = { sendEmailActivation};