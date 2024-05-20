import { CreateUserDTO } from "./dto/createUser.dto";
import { User, IUser } from "./schema/user";

import { NotFoundError } from "../utils/helper/customError";

export interface IUserRepository {
  create(createUserDto: CreateUserDTO): Promise<IUser>;
  update(id: string, payload: IUser): Promise<IUser>;
  delete(id: string): Promise<IUser>;
  getByEmail(email: string): Promise<IUser | null>;
  getOne(id: string): Promise<IUser>;
  getMany(limit: number, offset: number): Promise<IUser[]>;
}

export class UserRepository {
  constructor() {}

  async create(createUserDto: any): Promise<IUser> {
    return await User.create(createUserDto);
  }
  async update(id: string, payload: any): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
  async updateCode(id: string, code: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.referralCode = code;
    await user.save();
    return user;
  }
  async updatePoints(id: string, points: number): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.points += points;
    await user.save();
    return user;
  }

  async updateBalance(id: string, amountToAdd: any): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.balance += amountToAdd;
    user.points = 0; // Reset points
    await user.save();
    return user;
  }

  async getUserByReferralCode(referralCode: string): Promise<IUser> {
    const user = await User.findOne({ referralCode });
    if (!user) {
      throw new NotFoundError("User not found with the referral code");
    }
    return user;
  }
  async delete(id: string): Promise<IUser> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
  async getByEmail(email: string): Promise<any> {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
      // throw new NotFoundError('User not found');
    }
    return user;
  }
  async getOne(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
}
