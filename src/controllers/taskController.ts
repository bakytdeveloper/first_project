import { Request, Response } from 'express';
import Task from '../models/taskModel';
import {SortOrder} from "mongoose";

// Создание задачи
export const createTask = async (req: Request, res: Response) => {
    const { userId, description } = req.body;

    try {
        const newTask = new Task({ userId, description });
        await newTask.save();
        res.status(201).send('Task created');
    } catch (error) {
        res.status(500).send('Error creating task');
    }
};

// //   получение всех задач, если у тебя токин админа, а если у тебя токин
// //   определённого пользователя, то получает только свои задачи
// export const getTasks = async (req: Request, res: Response) => {
//     try {
//         let tasks;
//         // Проверяем, если роль пользователя - admin, получаем все задачи
//         if (req.user?.role === 'admin') {
//             tasks = await Task.find();
//         } else {
//             // В противном случае получаем задачи только текущего пользователя
//             tasks = await Task.find({ userId: req.user?.id });
//         }
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).send('Error fetching tasks');
//     }
// };




export const getTasks = async (req: Request, res: Response) => {
    try {
        // Получение параметров запроса
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
        // const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', ...filters } = req.query;

        // Преобразование параметров
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const sortOrderValue: SortOrder = sortOrder === 'desc' ? -1 : 1; // Используем 1 или -1 для сортировки

        // Построение запроса с фильтрацией
        // Типизация query как Record<string, any>
        const query: Record<string, any> = {};
        if (req.user?.role !== 'admin') {
            // Фильтрация задач текущего пользователя, если не админ
            query.userId = req.user?.id;
        }
        for (const [key, value] of Object.entries(filters)) {
            query[key] = value;
        }

        // Проверка, что sortBy является допустимым полем
        if (typeof sortBy !== 'string') {
            return res.status(400).send('Invalid sort field');
        }

        // Получение задач с фильтрацией, сортировкой и пагинацией
        const tasks = await Task.find(query)
            .sort({ [sortBy]: sortOrderValue }) // Теперь используется 1 или -1
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        // Подсчет общего количества задач
        const totalTasks = await Task.countDocuments(query);

        res.json({
            data: tasks,
            page: pageNumber,
            pageSize: pageSize,
            total: totalTasks,
            totalPages: Math.ceil(totalTasks / pageSize),
        });
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
};







//  Обновление задачи
export const updateTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const updateData = req.body;

    try {
        const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (error) {
        res.status(500).send('Error updating task');
    }
};


// Получение задачи по id
export const getTaskById = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        // Опционально: populate для получения информации о пользователе
        const task = await Task.findById(taskId).populate('userId', 'name');
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (error) {
        res.status(500).send('Error fetching task');
    }
};


// Удаление задачи
export const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) return res.status(404).send('Task not found');
        res.send('Task deleted');
    } catch (error) {
        res.status(500).send('Error deleting task');
    }
};
















