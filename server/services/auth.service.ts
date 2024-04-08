import User from "../models/user.model";

export const findUserByEmail = async (email: string) => await User.findOne({ email });
export const findUserByToken = async (token: string) => await User.findOne({ token });
export const findUserById = async (userId: string) => await User.findOne({ userId });