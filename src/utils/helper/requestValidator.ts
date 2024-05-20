import { validate } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";
import { RequestValidationError } from "./customError";

export const validateRequest = async (
  typeDTO: ClassConstructor<any>,
  request: any,
) => {
  const dto = plainToClass(typeDTO, request);

  const errors = await validate(
    dto,
    { whitelist: true, forbidNonWhitelisted: true },
    { validationError: { target: true } },
  );
  if (errors.length > 0) {
    const rejectedError = Promise.reject(new RequestValidationError(errors));
    return rejectedError;
  }
  return dto;
};
