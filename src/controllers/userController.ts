import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import * as fs from "fs";
import {SortOrder} from "mongoose";


// Регулярное выражение для проверки email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Регулярное выражение для проверки пароля (например, минимум 8 символов, одна цифра, одна буква)
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Создание пользователя (регистрация)
export const createUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    // Проверка формата email
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
    }

    // Проверка формата пароля
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Password must be at least 8 characters long and contain both letters and numbers');
    }

    try {
        // Проверка существующего пользователя
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists');

        // Проверка, существует ли уже администратор
        if (role === 'admin') {
            const adminUser = await User.findOne({ role: 'admin' });
            if (adminUser) return res.status(400).send('An admin already exists');
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
};


// Аутентификация пользователя (логин)
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Проверка формата email
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
    }

    // Проверка формата пароля
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Invalid password format');
    }

    try {
        // Поиск пользователя по email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        // Сравнение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid email or password');

        // Генерация токена с включением роли пользователя
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '10h' }
        );

        // Отправка токена
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
};



export const getUsers = async (req: Request, res: Response) => {
    try {
        // Получение параметров запроса
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
        // const { page = 1, limit = 10, sortBy = 'email', sortOrder = 'asc', ...filters } = req.query;

        // Преобразование параметров
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const sortOrderValue: 1 | -1 = sortOrder === 'desc' ? -1 : 1;

        // Преобразование фильтров в формат для MongoDB
        const query: Record<string, any> = {};
        for (const [key, value] of Object.entries(filters)) {
            query[key] = value;
        }

        // Проверка, что sortBy является допустимым полем
        if (typeof sortBy !== 'string') {
            return res.status(400).send('Invalid sort field');
        }

        // Получение пользователей с фильтрацией, сортировкой и пагинацией
        const users = await User.find(query)
            .sort({ [sortBy]: sortOrderValue })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        // Подсчет общего количества пользователей
        const totalUsers = await User.countDocuments(query);

        res.json({
            data: users,
            page: pageNumber,
            pageSize: pageSize,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
        });
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
};



// Получение информации о текущем пользователе
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // Доступ к текущему пользователю через req.user
        if (!req.user) return res.status(404).send('User not found');
        res.json(req.user);
    } catch (error) {
        res.status(500).send('Error fetching user');
    }
};


// Обновление пользователя
export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateData = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send('Error updating user');
    }
};


//   Контроллер для удаления пользователя.
export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
};


//  Здесь Сделал полный функционал для манипулирования аватарками
// Функция для создания директории, если она не существует
const ensureDirExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Настройки для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/avatars/';
        ensureDirExists(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    // Ограничил размера файла 1 МБ
    limits: { fileSize: 1 * 1024 * 1024 }
});

// Контроллер для загрузки аватара
export const uploadAvatar = async (req: Request, res: Response) => {
    upload.single('avatar')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send(`Multer error: ${err.message}`);
        } else if (err) {
            return res.status(500).send(`Server error: ${err.message}`);
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        try {
            // Получаем пользователя
            const user = await User.findById(req.user?.id); // req.user.id должен содержать ID текущего пользователя
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Если у пользователя уже есть аватар, удаляем его
            if (user.avatar) {
                fs.unlink(path.join(__dirname, '../../uploads/avatars/', user.avatar), (err) => {
                    if (err) {
                        console.error(`Failed to delete old avatar: ${err.message}`);
                    }
                });
            }

            // Обновляем поле avatar у пользователя
            user.avatar = req.file.filename;
            await user.save();

            res.send(`Avatar updated successfully: ${user.avatar}`);
        } catch (error) {
            res.status(500).send('Error updating avatar');
        }
    });
};


