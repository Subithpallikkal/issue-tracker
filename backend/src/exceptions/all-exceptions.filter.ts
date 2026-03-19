import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException, NotFoundException, ServerErrorException } from './custom.exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;
    let validationErrors: any = undefined;

    // Handle custom ValidationException
    if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorCode = 'VALIDATION_ERROR';
      details = exception.details;
      validationErrors = exception.validationErrors;
    }
    // Handle custom NotFoundException
    else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      errorCode = exception.errorCode || 'NOT_FOUND';
    }
    // Handle custom ServerErrorException
    else if (exception instanceof ServerErrorException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      errorCode = exception.errorCode || 'SERVER_ERROR';
      details = exception.details;
    }
    // Handle NestJS HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // Check if the response is already in our custom API format
        if ((exceptionResponse as any).success === false && (exceptionResponse as any).error) {
          // Return the pre-formatted response as-is
          return response.status(status).json(exceptionResponse);
        }
        
        message = (exceptionResponse as any).message || exception.message;
        const defaultError = (exceptionResponse as any).error;
        
        // Map common HTTP status codes to consistent error codes
        if (status === HttpStatus.UNAUTHORIZED) {
          errorCode = 'UNAUTHORIZED';
        } else if (status === HttpStatus.FORBIDDEN) {
          errorCode = 'FORBIDDEN';
        } else if (status === HttpStatus.NOT_FOUND) {
          errorCode = 'NOT_FOUND';
        } else if (status === HttpStatus.BAD_REQUEST) {
          errorCode = 'BAD_REQUEST';
        } else {
          errorCode = defaultError || 'HTTP_EXCEPTION';
        }
        
        // Handle validation pipe errors
        if ((exceptionResponse as any).message && Array.isArray((exceptionResponse as any).message)) {
          validationErrors = (exceptionResponse as any).message;
        }
      } else {
        message = exception.message;
        // Set error code based on status for string responses
        if (status === HttpStatus.UNAUTHORIZED) {
          errorCode = 'UNAUTHORIZED';
        } else if (status === HttpStatus.FORBIDDEN) {
          errorCode = 'FORBIDDEN';
        } else if (status === HttpStatus.NOT_FOUND) {
          errorCode = 'NOT_FOUND';
        } else {
          errorCode = 'HTTP_EXCEPTION';
        }
      }
    }
    // Handle unknown errors
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message,
        errorCode,
        ...(details && { details }),
        ...(validationErrors && { validationErrors }),
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }
}
