/**
 * Project Name: SoYummy
 *
 * Authors: Mateusz Potocki, Mateusz Karpiński
 */

import * as dotenv from "dotenv";
import Express from "express";
import passport from "passport";
import cors from "cors";
import http from "http";
import { Send, Query } from "express-serve-static-core";
import morgan from "morgan";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import Database from "./config/database";
import authRouter from "./routes/auth.routes";
import subscribeRouter from "./routes/subscribe.routes";
import verifyRouter from "./routes/verify.routes";
import recipesRouter from "./routes/recipes.routes";
import { initializeData } from "./utils/dataInicialization";
dotenv.config({ path: __dirname + "/.env" });

let app: Express.Application | undefined = undefined;
const PORT = process.env.PORT || 3001;
const mySecret = process.env.MONGO_URI;

const db = new Database(mySecret!, {});

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export interface TypedRequest<T extends Query, U> extends Express.Request {
  body: U;
  query: T;
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}

db.connect()
  .then(() => {
    initializeData().catch((error) =>
      console.error("Error initializing data:", error)
    );
  })
  .catch((err: any) => console.error("Error connecting to database:", err));

/**
 * Setup Express
 */

const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app = Express();
app.use(cors(options));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan("dev"));
import "./config/passport.ms";

/**
 * Routes
 */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "SoYummy API",
      description: "SoYummi API Information",
      version: "1.0.0",
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/auth/users", authRouter);
app.use("/auth/subscribe", subscribeRouter);
app.use("/auth/verify", verifyRouter);
app.use("/recipes", recipesRouter);
// app.use("/search");
// app.use("/ingredients");
// app.use("/ownRecipes");
// app.use("/popular-reciptes");
// app.use("/schopping-list");

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Database disconnected");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

http.createServer(app).listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT}: API: http://localhost:${PORT}/api-docs`
  );
});
