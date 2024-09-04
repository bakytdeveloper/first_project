import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';
import {authenticateToken, isAdmin} from "../middleware/authenticateToken";

const router = Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.put('/:id', authenticateToken, isAdmin, updateTask);
// router.put('/:id', authMiddleware, isAdmin, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;
