/**
 * Базовый класс для всех предсказуемых ошибок приложения.
 * statusCode используется error-handler middleware для формирования HTTP-ответа.
 * isOperational отличает "ожидаемые" ошибки (невалидный ввод, not found)
 * от программных багов — это стандартный паттерн для error-handling в Node.js.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id: string) {
        super(`${resource} with id "${id}" not found`, 404);
    }
}

export class ValidationError extends AppError {
    public readonly details: unknown;

    constructor(message: string, details?: unknown) {
        super(message, 400);
        this.details = details;
    }
}
