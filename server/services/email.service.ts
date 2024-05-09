import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const config = {
  pool: true,
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.FROM_EMAIL!,
    pass: process.env.EMAIL_PASSWORD!,
  },
} as const;

/**
 * Config file for nodemailer configuration and sending email
 * @param email 
 * @param verificationToken 
 * @returns 
 */
const send = async (email: string, verificationToken: string) => {
  let transporter = nodemailer.createTransport(config);
  let mailOptions = {
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: "Email Verification",
    text: `Please click the link below to verify your email:<br>http://localhost:3000/api/users/verify/${verificationToken}`,
  };

  return await transporter.sendMail(mailOptions);
};

export { send };
