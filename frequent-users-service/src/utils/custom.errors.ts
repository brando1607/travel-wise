export class CustomError extends Error {
  public statusCode: number;
  public message: string;
  public isCustomError: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isCustomError = true;

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  static newError({
    message,
    statusCode,
  }: {
    message: string;
    statusCode: number;
  }) {
    return new CustomError(message, statusCode);
  }
}
