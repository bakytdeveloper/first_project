import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

// // дделает доступ только админу
// export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//     if (req.user?.role !== 'admin') {
//         return res.status(403).send('Access denied');
//     }
//     next();
// };
//
// //  делает доступ только после аутентификации
// export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Получаем токен из заголовка
//
//     if (token == null) return res.status(401).send('Token not provided');
//
//     jwt.verify(token, process.env.JWT_SECRET || '', async (err, user: any) => {
//         if (err) return res.status(403).send('Invalid token');
//
//         // Ищем пользователя по ID из токена
//         if (user && user.id) { // Проверка, что user и user.id существуют
//             const foundUser = await User.findById(user.id);
//             if (!foundUser) return res.status(404).send('User not found');
//
//             req.user = foundUser; // Сохраняем пользователя в req.user для доступа в обработчиках
//             next();
//         } else {
//             return res.status(400).send('Invalid token structure');
//         }
//     });
// };






export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Получаем токен из заголовка

    if (token == null) return res.status(401).send('Token not provided');

    jwt.verify(token, process.env.JWT_SECRET || '', async (err, decoded: any) => {
        if (err) return res.status(403).send('Invalid token');

        // Ищем пользователя по ID из токена
        if (decoded && decoded.id) { // Проверка, что decoded и decoded.id существуют
            const foundUser = await User.findById(decoded.id);
            if (!foundUser) return res.status(404).send('User not found');

            req.user = foundUser; // Сохраняем пользователя в req.user для доступа в обработчиках
            next();
        } else {
            return res.status(400).send('Invalid token structure');
        }
    });
};