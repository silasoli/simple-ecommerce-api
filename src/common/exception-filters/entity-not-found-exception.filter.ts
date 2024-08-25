import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const field = this.extractFieldFromErrorMessage(exception.message);
    const exceptionMessage = TypeORMExceptionMessages[field] ?? [];
    const message = Array.isArray(exceptionMessage)
      ? exceptionMessage
      : [exceptionMessage];

    return this.sendErrorResponse(
      response,
      HttpStatus.NOT_FOUND,
      request.url,
      'Entidade não encontrada.',
      message,
    );
  }

  private sendErrorResponse(
    response: Response,
    status: HttpStatus,
    path: string,
    error: string,
    message: string[],
  ): void {
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: path,
      error: {
        message: message,
        error: error,
        statusCode: status,
      },
    });
  }

  private extractFieldFromErrorMessage(message: string): string | null {
    if (!message) return null;
    const match = message.match(/entity of type "([^"]+)"/);
    return match ? match[1].toLowerCase() : null;
  }
}

export const TypeORMExceptionMessages: Record<string, string> = {
  product: 'Produto não encontrado.',
};
