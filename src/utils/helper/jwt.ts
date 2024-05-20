import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import { JWTPayload } from "./customTypes";
import { BadRequestError } from "./customError";

const secret = process.env.JWT_SECRET as string;

export const createJWT = async (payload: object) => {
  const token = jwt.sign(payload, secret, { expiresIn: "5h" });
  return token;
};
export const createRefreshToken = async (payload: object) => {
  const token = jwt.sign(payload, secret, { expiresIn: "30d" });
  return token;
};

export const forgotPasswordCreateJWT = (payload: object) => {
  const token = jwt.sign(payload, secret, { expiresIn: "4h" });
  return token;
};

export const emailVerifyCreateJWT = async (payload: object) => {
  const token = jwt.sign(payload, secret, { expiresIn: "48h" });
  return token;
};

export const verifyJWT = async (token: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    // if (!decoded) {
    //   throw new BadRequestError('Invalid token');
    // }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new BadRequestError("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new BadRequestError("Invalid token");
    }
  }
};

export const generateRefreshToken = async (user: object) => {
  return createJWT(user);
};
