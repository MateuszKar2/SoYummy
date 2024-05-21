/**
 * Project Name: SoYummy
 *
 * Authors: Mateusz Potocki, Mateusz Karpiński
 */
import * as dotenv from "dotenv";
import Express from "express";
import { initializeMiddleware } from "./config/middlewares.config";
import http from "http";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import Database from "./config/database";
import { swaggerOptions } from "./config/swagger.config";
import initializeRouters from "./routes/index.routes"
import { initializeData } from "./utils/dataInitialization";
import "./config/passport.ms";
dotenv.config({ path: __dirname + "/.env" });

let app: Express.Application | undefined = undefined;
const PORT = process.env.PORT || 3001;
const mySecret = process.env.MONGO_URI;

const db = new Database(mySecret!, {});
db.connect()
  .then(() => {
    initializeData().catch((error) =>
      console.error("Error initializing data:", error)
    );
  })
  .catch((err: any) => console.error("Error connecting to database:", err));

app = Express();
initializeMiddleware(app);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
initializeRouters(app)
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
