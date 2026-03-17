export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor({ statusCode, code, message }: { statusCode: number; code: string; message: string}) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super({ statusCode: 404, code: 'NOT_FOUND', message });
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super({ statusCode: 400, code: 'BAD_REQUEST', message });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super({ statusCode: 401, code: 'UNAUTHORIZED', message });
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super({ statusCode: 403, code: 'FORBIDDEN', message });
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super({ statusCode: 409, code: 'CONFLICT', message });
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super({ statusCode: 500, code: 'INTERNAL_SERVER_ERROR', message });
    }
}