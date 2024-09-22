import { Request, Response, NextFunction } from "express";

type controllerFunction = (req: Request, res: Response, next?: NextFunction) => Promise<void>;

export const asyncErrorHandler = (fn: controllerFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};