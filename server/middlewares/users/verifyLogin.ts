import nodemailer from "nodemailer";
import SuspiciousLogin from "../../models/suspiciousLogin.model";
import Context from "../../models/context.model";
import Email from "../../models/email.model";
import { query, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { verifyLoginHTML } from "../../utils/emailTemplates";

interface CustomRequest
  extends Request<ParamsDictionary, any, any, Query, Record<string, any>> {
  currentContextData?: any;
  user?: any;
}

const CLIENT_URL = process.env.CLIENT_URL!;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE!;
const USER = process.env.FROM_EMAIL!;
const PASS = process.env.EMAIL_PASSWORD!;

const verifyLoginValidation = [
  query("email").isEmail().withMessage("Invalid email address"),
  query("id").isLength({ min: 24, max: 24 }),
  (req: Request, res: Response, _next: NextFunction) => {
    const errors = validationResult(res);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    _next();
  },
];

const config = {
  pool: true,
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
} as const;

const sendLoginVerification = async (req: CustomRequest, res: Response) => {
  const currentContextData = req.currentContextData;
  const { email, password } = req.user;

  const id = currentContextData.id;
  const verificationLink = `${CLIENT_URL}/auth/verify/login?id=${id}&email=${email}`;
  const blockLink = `${CLIENT_URL}/auth/verify/block?id=${id}&email=${email}`;

  console.log(id, verificationLink, blockLink);

  try {
    let transporter = nodemailer.createTransport(config);

    let info = await transporter.sendMail({
      from: `"SoYummy" <${USER}>`,
      to: email,
      subject: "Action Required: Verify New Login",
      html: verifyLoginHTML(email, verificationLink, blockLink),
    });

    const newVerification = new Email({
      email,
      verificationCode: id,
      messageId: info.messageId,
      forL: "login",
    });

    await newVerification.save();

    res.status(401).json({
      message: `Access blocked due to suspicious activity. Verification email sent to your email address.`,
    });
  } catch (err) {
    console.log(
      "Could not send email. There could be an issue with the provided credentials or the email service."
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyLogin = async (req: Request, res: Response) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    const newContextData = new Context({
      user: suspiciousLogin.user,
      email: suspiciousLogin.email,
      ip: suspiciousLogin.ip,
      city: suspiciousLogin.city,
      country: suspiciousLogin.country,
      device: suspiciousLogin.device,
      deviceType: suspiciousLogin.deviceType,
      browser: suspiciousLogin.browser,
      os: suspiciousLogin.os,
      platform: suspiciousLogin.platform,
    });
    await newContextData.save();
    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isTrusted: true, isBlocked: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login verified" });
  } catch (err) {
    res.status(500).json({ message: "Could not verify your login" });
  }
};

const blockLogin = async (req: Request, res: Response) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isBlocked: true, isTrusted: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login blocked" });
  } catch (err) {
    res.status(500).json({ message: "Could not block your login" });
  }
};

export {
  verifyLoginValidation,
  sendLoginVerification,
  verifyLogin,
  blockLogin,
};
