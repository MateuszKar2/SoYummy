// TODO: Naprwic błąd związany z tworzenie nowego użytkownika

import { Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import Joi, { ref } from "joi";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import Token from "../models/token.model";
import { findUserByEmail, findUserById } from "../services/auth.service";
import * as dotenv from "dotenv";
import { saveLogInfo } from "../middlewares/logger/logInfo";
import { verifyContextData, types } from "../controllers/auth.controller";
import Preference from "../models/preference.model";
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
): Promise<Response | void> => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const isConsentGiven = JSON.parse(req.body.isConsentGiven);
    const defaultAvatar =
      "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  
    const emailDomain = req.body.email.split("@")[1];
    const role = emailDomain === "soyummy.com" ? "admin" : "general";
    
    newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      avatar: defaultAvatar,
      role: role,
      isEmailVerified: isConsentGiven,
    });
  
    try {
      await newUser.save();
      
      if(newUser.isNew) {
        throw new Error("Failed to add user");
      }
      
      if(isConsentGiven === false) {
        res.status(201).json({
          message: "User added successfully."
        })
      } else {
        _next();
      }
    } catch (err) {
      console.log(err);
      
      res.status(400).json({
        message: "Failed to add user",
      })
    }  
};

interface CustomRequest
  extends Request<ParamsDictionary, any, any, Query, Record<string, any>> {
  mismatchedProps?: string[];
  currentContextData?: any;
  user?: any;
}

const signin = async (
  req: CustomRequest,
  res: Response,
  _next: NextFunction
): Promise<Response | void> => {
  await saveLogInfo(
    req,
    "User attempting to sign in",
    LOG_TYPE.SIGN_IN,
    LEVEL.INFO
  );

  try {
    const { value, error } = userSchema.validate(req.body);
    const { email, password } = value;

    const existingUser = await User.findOne({
      email: email,
    });

    if (!existingUser) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_EMAIL,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );

      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_PASSWORD,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isContextAuthEnabled = await Preference.findOne({
      user: existingUser._id,
      enableContextBasedAuth: true,
    });

    if (isContextAuthEnabled) {
      const contextDataResult = await verifyContextData(req, existingUser);

      if (contextDataResult === types.BLOCKED) {
        await saveLogInfo(
          req,
          MESSAGE.DEVICE_BLOCKED,
          LOG_TYPE.SIGN_IN,
          LEVEL.ERROR
        );

        return res.status(403).json({
          message:
            "You've been blocked due to suspicious login activity. Please contact support for assistance.",
        });
      }

      if (
        contextDataResult === types.NO_CONTEXT_DATA ||
        contextDataResult === types.ERROR
      ) {
        await saveLogInfo(
          req,
          MESSAGE.CONTEXT_DATA_VERIFY_ERROR,
          LOG_TYPE.SIGN_IN,
          LEVEL.ERROR
        );

        return res.status(500).json({
          message: "Error occurred while verifying context data.",
        });
      }

      if (contextDataResult === types.SUSPICIOUS) {
        await saveLogInfo(
          req,
          MESSAGE.MULTIPLE_ATTEMPT_WITHOUT_VERIFY,
          LOG_TYPE.SIGN_IN,
          LEVEL.WARN
        );

        return res.status(403).json({
          message: `You've temporarily been blocked due to suspicious login activity. We have already sent a verification email to your registered email address. 
          Please follow the instructions in the email to verify your identity and gain access to your account.

          Please note that repeated attempts to log in without verifying your identity will result in this device being permanently blocked from accessing your account.
          
          Thank you for your cooperation`,
        });
      }

      if (
        typeof contextDataResult === "object" &&
        "mismatchedProps" in contextDataResult
      ) {
        const mismatchedProps = contextDataResult.mismatchedProps;
        if (mismatchedProps) {
          const currentContextData = contextDataResult.currentContextData;
          if (
            mismatchedProps.some((prop) =>
              [
                "ip",
                "country",
                "city",
                "device",
                "deviceLOG_TYPE",
                "os",
                "platform",
                "browser",
              ].includes(prop)
            )
          ) {
            req.mismatchedProps = mismatchedProps;
            req.currentContextData = currentContextData;
            req.user = existingUser;
            return _next();
          }
        }
      }
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN!);

    const tokentDoc = new Token({
      user: existingUser._id,
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
    await tokentDoc.save();

    return res.json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (err: any) {
    await saveLogInfo(
      req,
      MESSAGE.SIGN_IN_ERROR + err.message,
      LOG_TYPE.SIGN_IN,
      LEVEL.ERROR
    );

    return res.status(500).json({
      message: "Something went wrong",
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
    const token = req.headers.authorization;
    const existingToken = await Token.findOne({
      accessToken: token,
    });

    console.log(existingToken);
    if (!existingToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const existingUser = await User.findById(existingToken.user);
    console.log(existingUser);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: "6h",
    });

    return res.status(200).json({
      accessToken,
      refreshToken: existingToken.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
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
export { signin, signup, logout, current };
