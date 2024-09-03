import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

interface TokenPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any; // Определите тип для user
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).send('Access Denied');
        next();
    } catch (error) {
        res.status(401).send('Invalid Token');
    }
};

export default authMiddleware;
