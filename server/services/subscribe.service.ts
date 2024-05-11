import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import Subscriber, { ISubscriber } from "../models/subscribe.model";
import User from "../models/user.model";
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

const transporterOptions = (email: string, content: string) => {
  let transporter = nodemailer.createTransport(config);
  const mailOptions = {
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: "Subscription to So Yummy Newsletter",
    text: content,
  };

  return transporter.sendMail(mailOptions)
};

const subscribe = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User not found");
  }

  const text: string =
    "You have successfully subscribed to the So Yummy Newsletter!";

  const subscriber = await Subscriber.findOne({ user: user._id });
  if(subscriber) {
    throw new Error("Subscriber already exists");
  }

  const newSubscriber: ISubscriber = new Subscriber({
    user: user._id,
    subscriber: true,
  });

  await newSubscriber.save();
  return transporterOptions(email, text);
};

const unsubscribe = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User not found");
  }

  const subscriber = await Subscriber.findOne({ user: user._id });
  if (!subscriber) {
    throw new Error("Subscriber not found");
  }

  const text: string = "You have successfully unsubscribed from the So Yummy Newsletter!"
  await subscriber.deleteOne({ email });
  return transporterOptions(email, text);
};
export { subscribe, unsubscribe };
