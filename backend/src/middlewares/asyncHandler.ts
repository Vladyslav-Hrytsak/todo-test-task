import { Request, Response, NextFunction, RequestHandler } from 'express';


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