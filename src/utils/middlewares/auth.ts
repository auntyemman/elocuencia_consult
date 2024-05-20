import { Request, Response, NextFunction } from "express";

import { verifyJWT } from "../helper/jwt";
import { BadRequestError, NotAuthorizedError } from "../helper/customError";
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new BadRequestError("Invalid or missing authorization header");
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = await verifyJWT(token);
    res.locals.user = decoded;
    next();
  } catch (err: any) {
    throw new NotAuthorizedError();
  }
};
