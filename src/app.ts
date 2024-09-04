import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import testRoutes from './routes/testRoutes';
import errorMiddleware from './middleware/errorMiddleware';
import loggerMiddleware from "./middleware/loggerMiddleware";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


dotenv.config();
connectDB();

const app = express();

//    Подключил swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Добавьте middleware для логирования запросов
app.use(loggerMiddleware);

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

//тестовые маршруты для генерации ошибок, и проверки отлова ошибок
app.use('/api/test', testRoutes);

app.use(errorMiddleware);

export default app;
