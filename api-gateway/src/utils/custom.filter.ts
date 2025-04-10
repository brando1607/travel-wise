import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { CustomResponse } from '../../../shared/custom.response';

@Catch()
export class CustomFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const dictionary = request.dictionary || {};

    if (exception instanceof CustomResponse) {
      return response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
        data: exception.data || null,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string' ? res : (res as any).message || 'Unknown error';
      return response.status(status).json({ statusCode: status, message });
    }

    const fallback = dictionary.errors?.fatal || {
      message: 'An unexpected error occurred',
    };
    return response
      .status(500)
      .json({ statusCode: 500, message: fallback.message });
  }
}
