import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  public details: any;
  public validationErrors: any;

  constructor(message: string, details?: any, validationErrors?: any) {
    super(message, HttpStatus.BAD_REQUEST);
    this.message = message;
    this.details = details;
    this.validationErrors = validationErrors;
  }
}

export class NotFoundException extends HttpException {
  public errorCode: string;

  constructor(message: string, errorCode?: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.message = message;
    this.errorCode = errorCode || 'NOT_FOUND';
  }
}

export class ServerErrorException extends HttpException {
  public errorCode: string;
  public details: any;

  constructor(message: string, errorCode?: string, details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.message = message;
    this.errorCode = errorCode || 'SERVER_ERROR';
    this.details = details;
  }
}
