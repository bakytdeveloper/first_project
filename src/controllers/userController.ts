import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import * as fs from "fs";


export const createUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    try {
        // Проверка существующего пользователя
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists');

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
};



export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
};

// Аутентификация пользователя
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid email or password');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
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
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
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
    limits: { fileSize: 5 * 1024 * 1024 } // Ограничение размера файла 5 МБ
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


