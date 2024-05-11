import nodemailer from "nodemailer";
import Preference from "../../models/preference.model";
import User from "../../models/user.model";
import Email from "../../models/email.model";
import { query, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { verifyEmailHTML } from "../../utils/emailTemplates";

interface CustomRequest
  extends Request<ParamsDictionary, any, any, Query, Record<string, any>> {
  userId?: string;
  email?: string;
}

const CLIENT_URL = process.env.CLIENT_URL!;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE!;
const USER = process.env.FROM_EMAIL!;
const PASS = process.env.EMAIL_PASSWORD!;

const verifyEmailValidation = [
  query("email").isEmail(),
  query("code").isLength({ min: 5, max: 5 }),
  (req: Request, res: Response, _next: NextFunction) => {
    const errors = validationResult(req);
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
  
const sendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationLink = `${CLIENT_URL}/auth/verify?code=${verificationCode}&email=${email}`;
  
  try {
    let transporter = nodemailer.createTransport(config);

    let info = await transporter.sendMail({
      from: `"SoYummy" <${USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: verifyEmailHTML(email, verificationLink, verificationCode),
    });

    const emailVerification = new Email({
      email,
      verificationCode,
      messageId: info.messageId,
      for: "signup",
    });

    await emailVerification.save();

    return res.status(200).json({
      message: `Verification email was successfully sent to ${email}`,
    });
  } catch (error) {
    console.log(
      "Could not send verification email. There could be an issue with the provided credentials or the email service."
    );
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
};

const verifyEmail = async (
  req: CustomRequest,
  res: Response,
  _next: NextFunction
) => {
  const { code, email } = req.query;
  
  try {
    const [isVerified, verification] = await Promise.all([
      User.findOne({ email: { $eq: email }, isEmailVerified: true }),
      Email.findOne({ email: { $eq: email }, verificationCode: { $eq: code } }),
    ]);

    console.log(code, email,"isVerified", isVerified, "verification", verification);
    
    if (isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (!verification) {
      return res
        .status(400)
        .json({ message: "Verification code is invalid or has expired" });
    }

    const updateUser = await User.findOneAndUpdate(
      { email: { $eq: email } },
      { isEmailVerified: true },
      { new: true }
    ).exec();

    await Promise.all([
      Email.deleteMany({ email: { $eq: email } }).exec(),
      new Preference({
        user: updateUser,
        enableContextBasedAuth: true,
      }).save(),
    ]);

    req.userId = updateUser?._id;
    req.email = updateUser?.email;
    _next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { verifyEmailValidation, sendVerificationEmail, verifyEmail };