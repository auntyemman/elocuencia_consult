import { UserRepository } from "./auth.repository";
import { CreateUserDTO } from "./dto/createUser.dto";
import { LoginDTO } from "./dto/login.dto";
import {
  APIError,
  BadRequestError,
  NotFoundError,
} from "../utils/helper/customError";
import {
  hashPassword,
  comparePasswords,
} from "../utils/helper/encryptPassword";
import { createJWT, verifyJWT } from "../utils/helper/jwt";
import { referralCode } from "../utils/helper/generateReferralCode";
import { ConversionRate, ReferralPoints } from "../utils/helper/constants";
import axios from "axios";

export class AuthService {
  private readonly userRepo = new UserRepository();
  private accountValidationUrl = "https://api.example.com/validate-account";

  async createUser(createUserDto: CreateUserDTO): Promise<any> {
    let { referralCode, username, firstName, lastName, email, password } =
      createUserDto;
    const user = await this.userRepo.getByEmail(email);
    if (user) {
      throw new BadRequestError("User already exists");
    }
    if (referralCode) {
      await this.addReferralPoints(referralCode);
    }
    const hashedPassword = await hashPassword(password);
    password = hashedPassword;
    const newUser = await this.userRepo.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      throw new APIError("Failed to create user");
    }
    return newUser;
  }

  async login(loginDto: LoginDTO): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userRepo.getByEmail(email);
    if (!user) {
      throw new NotFoundError("Not found");
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("Password not match");
    }
    const accessToken = await createJWT({
      userId: user._id,
      email: user.email,
    });
    return { accessToken, user };
  }

  async getReferralCode(id: string) {
    const code = referralCode();
    await this.userRepo.updateCode(id, code);
    return code;
  }

  async addReferralPoints(referralCode: string): Promise<any> {
    const user = await this.userRepo.getUserByReferralCode(referralCode);
    if (!user) {
      throw new NotFoundError("Invalid referral code");
    }
    await this.userRepo.updatePoints(user._id as string, ReferralPoints);
    return await this.convertPointsToBalance(user._id as string);
  }

  async convertPointsToBalance(userId: string): Promise<any> {
    const user = await this.userRepo.getOne(userId);
    const amountToAdd = user.points * ConversionRate;
    return await this.userRepo.updateBalance(user._id as string, amountToAdd);
  }

  async withdrawFunds(userId: string, amount: number, accountNumber: string, bankCode: string): Promise<any> {
    const user = await this.userRepo.getOne(userId);
    if (user.balance < amount) {
      throw new BadRequestError("Insufficient balance");
    }
    const negativeAmount = amount * -1;

    // Validate the account details
    await this.validateAccountDetails(accountNumber, bankCode);

    // Simulate the transfer
    await this.simulateTransfer(amount);
    return await this.userRepo.updateBalance(
      user._id as string,
      negativeAmount,
    );
  }

  private async validateAccountDetails(
    accountNumber: string,
    bankCode: string,
  ): Promise<void> {
    try {
      const response = await axios.post(this.accountValidationUrl, {
        accountNumber,
        bankCode,
      });

      if (!response.data.valid) {
        throw new BadRequestError("Invalid account details");
      }
    } catch (error) {
      throw new APIError("Account validation failed");
    }
  }

  private async simulateTransfer(amount: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }
}
