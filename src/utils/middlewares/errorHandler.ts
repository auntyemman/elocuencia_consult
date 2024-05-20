import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  BadRequestError,
  RequestValidationError,
  NotFoundError,
  APIError,
  DatabaseConnectionError,
  NotAuthorizedError,
} from "../helper/customError";
import winston from "winston";

// Configure Winston logger to log to a file
const logger = winston.createLogger({
  transports: new winston.transports.File({
    filename: "error.log",
    level: "error",
  }),
});

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof APIError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  if (err instanceof NotAuthorizedError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  } else {
    // Log the error that was not caught to the file
    logger.error(
      `${req.originalUrl} - ${req.method} - ${req.ip} - ${err.message}`,
    );

    // Send a generic error response to the client
    return res.status(400).send({
      errors: [{ message: err.message }],
    });
  }
};
