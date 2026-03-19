"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("./custom.exceptions");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorCode = 'INTERNAL_SERVER_ERROR';
        let details = undefined;
        let validationErrors = undefined;
        if (exception instanceof custom_exceptions_1.ValidationException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
            errorCode = 'VALIDATION_ERROR';
            details = exception.details;
            validationErrors = exception.validationErrors;
        }
        else if (exception instanceof custom_exceptions_1.NotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
            errorCode = exception.errorCode || 'NOT_FOUND';
        }
        else if (exception instanceof custom_exceptions_1.ServerErrorException) {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
            errorCode = exception.errorCode || 'SERVER_ERROR';
            details = exception.details;
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                if (exceptionResponse.success === false && exceptionResponse.error) {
                    return response.status(status).json(exceptionResponse);
                }
                message = exceptionResponse.message || exception.message;
                const defaultError = exceptionResponse.error;
                if (status === common_1.HttpStatus.UNAUTHORIZED) {
                    errorCode = 'UNAUTHORIZED';
                }
                else if (status === common_1.HttpStatus.FORBIDDEN) {
                    errorCode = 'FORBIDDEN';
                }
                else if (status === common_1.HttpStatus.NOT_FOUND) {
                    errorCode = 'NOT_FOUND';
                }
                else if (status === common_1.HttpStatus.BAD_REQUEST) {
                    errorCode = 'BAD_REQUEST';
                }
                else {
                    errorCode = defaultError || 'HTTP_EXCEPTION';
                }
                if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
                    validationErrors = exceptionResponse.message;
                }
            }
            else {
                message = exception.message;
                if (status === common_1.HttpStatus.UNAUTHORIZED) {
                    errorCode = 'UNAUTHORIZED';
                }
                else if (status === common_1.HttpStatus.FORBIDDEN) {
                    errorCode = 'FORBIDDEN';
                }
                else if (status === common_1.HttpStatus.NOT_FOUND) {
                    errorCode = 'NOT_FOUND';
                }
                else {
                    errorCode = 'HTTP_EXCEPTION';
                }
            }
        }
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
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map