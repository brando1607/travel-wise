export class CustomError extends Error {
  public statusCode: number;
  public message: string;
  public data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static newError({ message, statusCode }) {
    throw new CustomError(message, statusCode);
  }
}
