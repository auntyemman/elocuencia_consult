import { Router } from "express";
import { auth } from "./auth/auth.route";

export const router: Router = Router();

// each route
router.use("/auth", auth);
