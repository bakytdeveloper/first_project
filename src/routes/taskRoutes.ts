import { Router } from 'express';
import {createTask, getTasks, updateTask, deleteTask, getTaskById} from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';
import {authenticateToken, isAdmin} from "../middleware/authenticateToken";

const router = Router();

// Создание задачи (для администратора)
router.post('/', authenticateToken, isAdmin, createTask);
// router.post('/', authMiddleware, createTask);

// Получение всех задач
router.get('/', authMiddleware, getTasks);

// Получение задачи по id задачи (для администратора)
router.get('/:id', authenticateToken, isAdmin, getTaskById);

// Обновление задачи по id (для администратора)
router.put('/:id', authenticateToken, isAdmin, updateTask);

// Удаление задачи по id
router.delete('/:id', authMiddleware, isAdmin, deleteTask);

export default router;
