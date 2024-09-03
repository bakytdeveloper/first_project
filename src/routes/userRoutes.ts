import { Router } from 'express';
import { createUser, getUsers, loginUser, updateUser, uploadAvatar } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', createUser);
router.get('/', authMiddleware, getUsers);
router.post('/login', loginUser);
router.put('/:id', authMiddleware, updateUser);
router.post('/upload', authMiddleware, uploadAvatar);

export default router;
