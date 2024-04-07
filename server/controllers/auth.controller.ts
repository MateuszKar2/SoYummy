import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import Token from "../models/token.model";
import { findUserByEmail, findUserById } from "../services/auth.service";
import * as dotenv from "dotenv";
import { saveLogInfo } from "../middlewares/logger/logInfo";
dotenv.config({ path: __dirname + "/.env" });

const LOG_TYPE = {
  SIGN_IN: "sign in",
  LOGOUT: "logout",
} as const;

const LEVEL = {
  INFO: "info",
  ERROR: "error",
  WARN: "warn",
} as const;

const MESSAGE = {
  SIGN_IN_ATTEMPT: "User attempting to sign in",
  SIGN_IN_ERROR: "Error occurred while signing in user: ",
  INCORRECT_EMAIL: "Incorrect email",
  INCORRECT_PASSWORD: "Incorrect password",
  DEVICE_BLOCKED: "Sign in attempt from blocked device",
  CONTEXT_DATA_VERIFY_ERROR: "Context data verification failed",
  MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
    "Multiple sign in attempts detected without verifying identity.",
  LOGOUT_SUCCESS: "User has logged out successfully",
} as const;

interface UserInput {
  email: string;
  password: string;
}

const userSchema = Joi.object<UserInput>({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(7).required(),
});

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const validPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => bcrypt.compare(password, hashPassword);

const signup = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { value, error } = userSchema.validate(req.body);
    const { email, password } = value;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const toLowerCaseEmail = email.toLowerCase();
    const user = await findUserByEmail(toLowerCaseEmail);

    if (user) {
      return res.status(409).json({
        status: "Error",
        code: 409,
        message: "Email in use",
        data: "Conflict",
      });
    }

    const hashedPassword = await hashPassword(password);

    const verificationToken = uuidv4();

    await new User({
      email: toLowerCaseEmail,
      password: hashedPassword,
      verificationToken: verificationToken,
    }).save();

    return res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: {
          email: toLowerCaseEmail,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Server error",
    });
  }
};

const signin = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { value, error } = userSchema.validate(req.body);
    const { email, password } = value;

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const toLowerCaseEmail = email.toLowerCase();
    const user = await findUserByEmail(toLowerCaseEmail);

    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrond",
        data: "Unauthorized",
      });
    }
    const isPasswordValid = await validPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
        data: "Unauthorized",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET!, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN!
    );

    const tokentDoc = new Token({
      user: user._id,
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
    await tokentDoc.save();
    return res.json({
      status: "Success",
      code: 200,
      token: accessToken,
      user: {
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Server error",
    });
  }
};

const logout = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1] ?? null;

    if (accessToken) {
      await Token.deleteOne({ accessToken });
      await saveLogInfo(
        null,
        MESSAGE.LOGOUT_SUCCESS,
        LOG_TYPE.LOGOUT,
        LEVEL.INFO
      );
    }
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err: any) {
    await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
    res.status(500).json({
      status: "Error",
      code: 500,
      message: "Server error",
    });
  }
};

const current = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );
    const userId = decodedToken.userId;

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        code: 404,
        message: "User not found",
      });
    }

    return res.json({
      status: "Success",
      code: 200,
      data: {
        currentUser: {
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Server error",
    });
  }
};

export { signup, signin, logout, current };
