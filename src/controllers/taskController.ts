import { Request, Response } from 'express';
import Task from '../models/taskModel';

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

//   получение всех задач, если у тебя токин админа, а если у тебя токин
//   определённого пользователя, то получает только свои задачи
export const getTasks = async (req: Request, res: Response) => {
    try {
        let tasks;
        // Проверяем, если роль пользователя - admin, получаем все задачи
        if (req.user?.role === 'admin') {
            tasks = await Task.find();
        } else {
            // В противном случае получаем задачи только текущего пользователя
            tasks = await Task.find({ userId: req.user?.id });
        }
        res.json(tasks);
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
















