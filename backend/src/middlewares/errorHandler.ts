import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors';


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

    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
}