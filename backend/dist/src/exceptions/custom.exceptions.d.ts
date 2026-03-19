import { HttpException } from '@nestjs/common';
export declare class ValidationException extends HttpException {
    details: any;
    validationErrors: any;
    constructor(message: string, details?: any, validationErrors?: any);
}
export declare class NotFoundException extends HttpException {
    errorCode: string;
    constructor(message: string, errorCode?: string);
}
export declare class ServerErrorException extends HttpException {
    errorCode: string;
    details: any;
    constructor(message: string, errorCode?: string, details?: any);
}
