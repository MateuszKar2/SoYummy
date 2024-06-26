import rateLimit from "express-rate-limit";
const MESSAGE = "Too many requests, please try again later.";

const createLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
  });
};

const configLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const logLimiter = createLimiter(60 * 60 * 1000, 3500, MESSAGE);
const createPostLimiter = createLimiter(5 * 60 * 1000, 20, MESSAGE);
const likeSaveLimiter = createLimiter(10 * 60 * 1000, 250, MESSAGE);
const followLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
const signUpSignInLimiter = createLimiter(10 * 60 * 1000, 100, MESSAGE);
const commentLimiter = createLimiter(5 * 60 * 1000, 100, MESSAGE);

export {
  configLimiter,
  logLimiter,
  createPostLimiter,
  likeSaveLimiter,
  followLimiter,
  signUpSignInLimiter,
  commentLimiter,
};
