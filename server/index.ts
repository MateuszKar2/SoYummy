/**
 * Project Name: SoYummy
 * 
 * Authors: Mateusz Potocki, Mateusz Karpiński
 */

import dotenv from 'dotenv';
import Express from 'express';
import passport from 'passport';
import cors from 'cors';
import http from 'http';
import { Send, Query } from 'express-serve-static-core';
import morgan from 'morgan';
import Database from './config/database';

dotenv.config();
let app: Express.Application | undefined = undefined;
const PORT = process.env.PORT || 3001;
const db = new Database(process.env.MONGO_URI!, { })

export interface TypedRequestBody<T> extends Express.Request {
    body: T
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
    query: T
}

export interface TypedRequest<T extends Query, U> extends Express.Request {
    body: U,
    query: T
}

export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}


db.connect().catch((err: any) =>
  console.error("Error connecting to database:", err)
);

/**
* Setup Express
*/

app = Express();
app.use(Express.urlencoded({ extended: true }));
app.use(passport.initialize())

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));
app.use(Express.json());
app.use(morgan('dev'));

/**
* Routes
*/

app.get('/', function (_req: Express.Request, res: Express.Response) {
    res.status(200).json({
        messaage: 'Welcome to SoYummy API'
    });
});

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Database disconnected");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})

http.createServer(app).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})