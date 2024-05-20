import { Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import Token from "../models/token.model";
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
  });

  try {
    await newUser.save();

    if (newUser.isNew) {
      throw new Error("Failed to add user");
    }

    if (isConsentGiven === false) {
      res.status(201).json({
        message: "User added successfully.",
        user: { newUser },
      });
    } else {
      _next();
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to add user",
    });
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
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email: { $eq: email },
    });

    console.log("existingUser", existingUser);
    
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

        return res.status(401).json({
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
        const currentContextData = contextDataResult.currentContextData;
        if (mismatchedProps) {
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
      role: existingUser.role,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN!, {
      expiresIn: "7d",
    });

    const newRefreshToken  = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken .save();

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

const refreshToken = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const refreshToken = req.headers.authorization;
    
    const existingToken = await Token.findOne({
      accessToken: { $eq: refreshToken },
    });

    if (!existingToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const existingUser = await User.findById(existingToken.user);
    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid refresh token",
      });
    }

    const refreshTokenExpiresAt =
      (jwt.decode(existingToken.refreshToken) as jwt.JwtPayload).exp! * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await existingToken.deleteOne();
      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET!, {
      expiresIn: "6h",
    });

    res.status(200).json({
      accessToken,
      refreshToken: existingToken.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { signin, signup, logout, refreshToken };
