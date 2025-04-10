export class CustomResponse extends Error {
  public statusCode: number;
  public message: string;
  public data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static newResponse({
    message,
    statusCode,
    data,
  }: {
    message: string;
    statusCode: number;
    data?: any;
  }) {
    return new CustomResponse(message, statusCode, data);
  }
  static newError({ message, statusCode }) {
    throw new CustomResponse(message, statusCode);
  }
}
