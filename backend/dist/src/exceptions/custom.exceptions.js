"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrorException = exports.NotFoundException = exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
class ValidationException extends common_1.HttpException {
    details;
    validationErrors;
    constructor(message, details, validationErrors) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
        this.message = message;
        this.details = details;
        this.validationErrors = validationErrors;
    }
}
exports.ValidationException = ValidationException;
class NotFoundException extends common_1.HttpException {
    errorCode;
    constructor(message, errorCode) {
        super(message, common_1.HttpStatus.NOT_FOUND);
        this.message = message;
        this.errorCode = errorCode || 'NOT_FOUND';
    }
}
exports.NotFoundException = NotFoundException;
class ServerErrorException extends common_1.HttpException {
    errorCode;
    details;
    constructor(message, errorCode, details) {
        super(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        this.message = message;
        this.errorCode = errorCode || 'SERVER_ERROR';
        this.details = details;
    }
}
exports.ServerErrorException = ServerErrorException;
//# sourceMappingURL=custom.exceptions.js.map