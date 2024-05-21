import Express from "express";
import cors from "cors";
import passport from "passport";
import morgan from "morgan";

const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export function initializeMiddleware(app: Express.Application) {
  app.use(cors(options));
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(morgan("dev"));
}
