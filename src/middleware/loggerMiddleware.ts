// src/middleware/loggerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from './utils/loger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
};

export default loggerMiddleware;
