import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Token from "../models/token.model";

/**
 * @async
 * @function verificationUser
 * @description Handles the user verification request. It takes the verification token from the request parameters, verifies the token, checks if the user is already verified, and updates the user's verification status if necessary.
 * @param {Request} req - The request object, containing the verification token in the parameters.
 * @param {Response} res - The response object.
 * @param {NextFunction} _next - The next middleware function in the Express.js request-response cycle.
 * @returns {Promise<Response|void>} A promise that resolves to the response object if the verification is successful or if an error occurs during the verification process. If an error occurs during the execution of the function, the promise resolves to the execution of the next middleware function with the error as an argument.
 */
const verificationUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { verificationToken } = req.params;

  try {
    const tokenResponse = await Token.findOne({
      verificationToken: verificationToken,
    });
    
    if (!tokenResponse) {
      return res.status(404).json({ message: "Token not found." });
    }

    const user = await User.findOne({ _id: tokenResponse.user });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: tokenResponse.user },
      { isEmailVerified: true }
    );
    return res.status(200).json({ message: "Email verified successfully.", verificationToken: verificationToken, result: updatedUser });
  } catch (err) {
    _next(err);
  }
};

/**
 * @async
 * @function verifyResend
 * @description Handles the request to resend the verification token. It takes the user's email from the request body, finds the user and the verification token associated with the user in the database, and resends the verification token if it exists.
 * @param {Request} req - The request object, containing the user's email in the body.
 * @param {Response} res - The response object.
 * @param {NextFunction} _next - The next middleware function in the Express.js request-response cycle.
 * @returns {Promise<Response|void>} A promise that resolves to the response object if the user or the verification token is not found. If an error occurs during the execution of the function, the promise resolves to the execution of the next middleware function with the error as an argument.
 */
const verifyResend = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const verificationToken = await Token.findById({ user: user._id });
    if (!verificationToken) return res.status(404).json({ message: "Token not found." });
    
  } catch (err) {
    _next(err);
  }
};

export { verifyResend, verificationUser }