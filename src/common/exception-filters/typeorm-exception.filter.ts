import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError, QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError | TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isQueryFailedError = exception instanceof QueryFailedError;

    if (!isQueryFailedError || !exception['code']) {
      return this.sendErrorResponse(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        request.url,
        'Erro de integridade com banco de dados',
        [],
      );
    }

    const errorInfo = this.getErrorInfo(exception['code']);
    const field = this.extractFieldFromErrorMessage(exception['detail']);
    const message = field ? [errorInfo.messageByField(field)] : [];

    return this.sendErrorResponse(
      response,
      errorInfo.status,
      request.url,
      errorInfo.error,
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

  private getErrorInfo(code: string): TypeORMException {
    return (
      TypeORMErrors[code] || {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal server error',
        messageByField: (): string => 'Internal server error',
      }
    );
  }

  private extractFieldFromErrorMessage(message: string): string | undefined {
    if (!message) return undefined;
    const match = message.match(/Key \(([^)]+)\)=/);
    return match ? match[1] : undefined;
  }
}

export type TypeORMException = {
  status: HttpStatus;
  error: string;
  messageByField: (field: string) => string;
};

export const TypeORMErrors: Record<string, TypeORMException> = {
  '23505': {
    status: HttpStatus.CONFLICT,
    error: 'Conflict',
    messageByField: (field: string): string => {
      return (
        TypeORMExceptionMessages['23505'][field] ||
        TypeORMExceptionMessages['23505'].default
      );
    },
  },
  '42P01': {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    error: 'Relation does not exist',
    messageByField: (): string => {
      return TypeORMExceptionMessages['42P01'].default;
    },
  },
};

export const TypeORMExceptionMessages: Record<
  string,
  Record<string, string>
> = {
  '23505': {
    username: 'O nome de usuário já está em uso.',
    email: 'Este endereço de e-mail já está em uso.',
    default: 'Erro de chave duplicada.',
  },
  '42P01': {
    default: 'A relação solicitada não existe.',
  },
};
