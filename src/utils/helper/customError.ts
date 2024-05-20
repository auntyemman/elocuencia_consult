import { ValidationError } from "class-validator";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid Login Parameters.");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return this.errors.map((error) => {
      const field = error.property ? error.property : "Unknown field";
      return {
        message: error.constraints
          ? Object.values(error.constraints)[0]
          : "Validation error",
        field,
      };
    });
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class APIError extends CustomError {
  statusCode = 500;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    // Calling the parent class constructor as this is a constructor of sub-class
    super("Not Authorised.");

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Authorised." }];
  }
}

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  reason = "Error connecting to database!!!";

  constructor() {
    // Calling the parent class (Error) constructor as this is a constructor of sub-class
    super("Error connecting to database!!!");

    // Since we are extending a built-in class (Error) the following line of cade has to be added
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
