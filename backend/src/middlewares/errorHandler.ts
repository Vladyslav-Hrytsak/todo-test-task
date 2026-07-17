import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors';

/**
 * Централизованный обработчик ошибок — последний middleware в цепочке.
 * Controller-слой просто делает `next(error)`, вся логика формирования
 * HTTP-ответа сосредоточена здесь (Single Responsibility).
 */
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
): void {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    // Непредвиденная ошибка — не палим stack trace клиенту, логируем на сервере
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
}