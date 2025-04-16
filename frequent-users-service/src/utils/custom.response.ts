export class CustomResponse {
  constructor(
    public message: string,
    public statusCode: number,
    public data: any = null,
    public isCustomResponse: boolean = true,
  ) {}

  static newResponse({ message, statusCode, data }) {
    return new CustomResponse(message, statusCode, data);
  }
}
