import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Оборачивает async-контроллер, автоматически прокидывая брошенные ошибки в next().
 * Generic-параметры проброшены насквозь, чтобы обёртка не "стирала"
 * специфичную типизацию req.params (например, TaskParams) до общего ParamsDictionary.
 */
export function asyncHandler<
P = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = unknown,
>(
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction,
    ) => Promise<void>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}