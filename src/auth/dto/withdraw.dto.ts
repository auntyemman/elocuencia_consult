import { IsString, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class WithdrawDTO {
  @IsNumber()
  @IsNotEmpty()
  amount!: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber!: number;

  @IsString()
  @IsNotEmpty()
  bankCode!: string;
}
