import { Request, Response, NextFunction } from "express";
import { CreateUserDTO } from "./dto/createUser.dto";
import { AuthService } from "./auth.service";
import { validateRequest } from "../utils/helper/requestValidator";
import {
  APIError,
  BadRequestError,
  NotFoundError,
} from "../utils/helper/customError";
import { LoginDTO } from "./dto/login.dto";
import { verifyJWT } from "../utils/helper/jwt";
import { WithdrawDTO } from "./dto/withdraw.dto";

export class AuthController {
  private readonly authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await validateRequest(CreateUserDTO, req.body);
      const newUser = await this.authService.createUser(validated);
      if (!newUser) {
        throw new APIError("Failed to create user");
      }
      return res.status(201).json({
        status: "success",
        message: `User created successfully`,
        data: newUser,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<object | void> {
    try {
      const validated = await validateRequest(LoginDTO, req.body);
      const { accessToken, user } = await this.authService.login(validated);
      const { firstName } = user;
      return res.status(200).json({
        status: "success",
        message: "Logged in successfully, token exists",
        data: { accessToken, firstName },
      });
    } catch (error) {
      next(error);
    }
  }
  async getReferralCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<object | void> {
    const userId = res.locals.user.userId;
    try {
      const referralCode = await this.authService.getReferralCode(userId);
      return res.status(200).json({
        status: "success",
        message: "Referral code generated successfully",
        data: referralCode,
      });
    } catch (error) {
      next(error);
    }
  }

  async withdrawal(req: Request, res: Response, next: NextFunction) {
    const userId = res.locals.user.userId;
    try {
      const validated = await validateRequest(WithdrawDTO, req.body);
      const { amount, accountNumber, bankCode } = validated;
      const withdrawal = await this.authService.withdrawFunds(
        userId,
        amount,
        accountNumber,
        bankCode,
      );
      return res.status(200).json({
        status: "success",
        message: "Withdrawal successful",
        data: {
          amount: validated.amount.toString(),
          balance: withdrawal.balance.toString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
