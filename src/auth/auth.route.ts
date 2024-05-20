import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authUser } from "../utils/middlewares/auth";

export const auth: Router = Router();
const authController = new AuthController();

auth.post("/register", authController.register.bind(authController));
auth.post("/login", authController.login.bind(authController));
auth.get(
  "/referral-code",
  authUser,
  authController.getReferralCode.bind(authController),
);
auth.post(
  "/withdrawal",
  authUser,
  authController.withdrawal.bind(authController),
);
