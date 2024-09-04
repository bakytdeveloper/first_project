import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import testRoutes from './routes/testRoutes';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from "./middleware/loggerMiddleware";

dotenv.config();
connectDB();

const app = express();

// Добавьте middleware для логирования запросов
app.use(loggerMiddleware);

// Подключите тестовые маршруты
app.use('/test', testRoutes);

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

//тестовые маршруты для генерации ошибок, и проверки отлова ошибок
app.use('/api/test', testRoutes);

app.use(errorMiddleware);

export default app;
