// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from "./utils/loger";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

export default errorMiddleware;
