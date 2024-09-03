import { Router } from 'express';
import {
    createUser,
    getUsers,
    loginUser,
    getCurrentUser,
    updateUser,
    uploadAvatar,
    deleteUser
} from '../controllers/userController';
import {authenticateToken, isAdmin} from "../middleware/authenticateToken";

const router = Router();

// Регистрация нового пользователя
router.post('/register', createUser);

// Получение списка пользователей, доступно только аутентифицированным пользователям
router.get('/', authenticateToken, getUsers);

// Вход пользователя
router.post('/login', loginUser);

// Обновление информации о пользователе
router.put('/:id', authenticateToken, updateUser);

// Получение информации о текущем пользователе
router.get('/me', authenticateToken, getCurrentUser);

// Маршрут для загрузки аватара
router.post('/upload-avatar', authenticateToken, uploadAvatar);

// Удаление пользователя доступно только администратору
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;
