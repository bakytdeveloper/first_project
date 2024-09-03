import { Router } from 'express';
import { createUser, getUsers, loginUser, getCurrentUser, updateUser, uploadAvatar } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import {authenticateToken} from "../middleware/authenticateToken";

const router = Router();
//
// router.post('/register', createUser);
// router.get('/', authMiddleware, getUsers);
// router.post('/login', loginUser);
// router.put('/:id', authMiddleware, updateUser);
// router.put('/:id', authenticateToken, getCurrentUser);
// router.post('/upload', authMiddleware, uploadAvatar);

router.post('/register', createUser);
router.get('/', authenticateToken, getUsers);
router.post('/login', loginUser);
router.put('/:id', authenticateToken, updateUser);
router.get('/:id', authenticateToken, getCurrentUser);
router.post('/upload', authenticateToken, uploadAvatar);

export default router;
