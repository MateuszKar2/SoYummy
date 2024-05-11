import { check, validationResult } from "express-validator";
import User from "../../models/user.model";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

export const addUserValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(
            "There is already an account associated with this email address"
          );
        }
      } catch (err) {
        throw err;
      }
    }),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  check("role").default("general"),
];
interface IFile {
  filename: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

declare global {
  namespace Express {
    interface Request {
      files?: IFile[];
    }
  }
}

export const addUserValidatorHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    _next();
  } else {
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      const filePath = path.join(
        __dirname,
        `../../assets/userAvatars/${filename}`
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log(`${filename} has been deleted`);
      });
    }
    res
      .status(400)
      .json({ errors: Object.values(mappedErrors).map((error) => error.msg) });
  }
};
