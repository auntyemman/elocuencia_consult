import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import "reflect-metadata";
import cookieParser from "cookie-parser";

import { errorHandler } from "./utils/middlewares/errorHandler";
import { router } from "./index.routes";

config();

export class App {
  private readonly app: Application;
  private readonly port;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 1000;
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`app is running on port ${this.port}`);
    });
  }

  private setupMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    // this.app.use(helmet());
    this.app.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      }),
    );
  }

  private setupErrorHandling() {
    this.app.use(errorHandler);
  }

  private setupRoutes() {
    this.app.use("/v1", router);
    this.app.get("/", (req: Request, res: Response) => {
      return res.status(200).send("Hello, elocuencia!");
    });
  }
}
