import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
} from "class-validator";

/*-------------------------------------------CreateUserDTO-------------------------------------------*/
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      "Password must contain at least one digit, one lowercase, one uppercase letter, and one special character",
  })
  password!: string;

  @IsOptional()
  @IsString()
  referralCode!: string;
}
