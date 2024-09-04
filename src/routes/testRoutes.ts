// src/routes/testRoutes.ts
import { Router } from 'express';

const router = Router();

// Маршрут для генерации ошибки 404
router.get('/error404', (req, res) => {
    res.status(404).send('Resource not found');
});

// Маршрут для генерации внутренней ошибки сервера
router.get('/error500', (req, res) => {
    throw new Error('Internal Server Error');
});

export default router;
