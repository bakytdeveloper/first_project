// import { Request, Response } from 'express';
// import Task from '../models/taskModel';
//
// export const createTask = async (req: Request, res: Response) => {
//     const { userId, description } = req.body;
//
//     // Проверка роли администратора
//     if (req.user?.role !== 'admin') {
//         return res.status(403).send('Access denied');
//     }
//
//     try {
//         const newTask = new Task({ userId, description });
//         await newTask.save();
//         res.status(201).send('Task created');
//     } catch (error) {
//         res.status(500).send('Error creating task');
//     }
// };
//
// export const getTasks = async (req: Request, res: Response) => {
//     try {
//         const tasks = await Task.find();
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).send('Error fetching tasks');
//     }
// };
//
// export const updateTask = async (req: Request, res: Response) => {
//     const taskId = req.params.id;
//     const updateData = req.body;
//     try {
//         const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
//         if (!task) return res.status(404).send('Task not found');
//         res.json(task);
//     } catch (error) {
//         res.status(500).send('Error updating task');
//     }
// };
//
// export const deleteTask = async (req: Request, res: Response) => {
//     const taskId = req.params.id;
//     try {
//         const task = await Task.findByIdAndDelete(taskId);
//         if (!task) return res.status(404).send('Task not found');
//         res.send('Task deleted');
//     } catch (error) {
//         res.status(500).send('Error deleting task');
//     }
// };



import { Request, Response } from 'express';
import Task from '../models/taskModel';

// Создание задачи
export const createTask = async (req: Request, res: Response) => {
    const { userId, description } = req.body;

    // Проверка роли администратора
    if (req.user?.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    try {
        const newTask = new Task({ userId, description });
        await newTask.save();
        res.status(201).send('Task created');
    } catch (error) {
        res.status(500).send('Error creating task');
    }
};

// // Получение задач
// export const getTasks = async (req: Request, res: Response) => {
//     const { userId } = req.query;
//
//     try {
//         // Если `userId` указан, фильтруем задачи по пользователю
//         const filter = userId ? { userId } : {};
//         const tasks = await Task.find(filter);
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).send('Error fetching tasks');
//     }
// };


export const getTasks = async (req: Request, res: Response) => {
    try {
        // Если запрос от администратора, возвращаем все задачи
        if (req.user?.role === 'admin') {
            const tasks = await Task.find();
            return res.json(tasks);
        }

        // Если запрос от обычного пользователя, возвращаем только его задачи
        const tasks = await Task.find({ userId: req.user?.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
};




// Обновление задачи
// export const updateTask = async (req: Request, res: Response) => {
//     const taskId = req.params.id;
//     const updateData = req.body;
//
//     try {
//         const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
//         if (!task) return res.status(404).send('Task not found');
//         res.json(task);
//     } catch (error) {
//         res.status(500).send('Error updating task');
//     }
// };

export const updateTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const updateData = req.body;

    try {
        // // Проверяем, что пользователь является администратором
        // if (req.user?.role !== 'admin') {
        //     return res.status(403).send('Access denied');
        // }

        const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (error) {
        res.status(500).send('Error updating task');
    }
};



// Получение задачи по id (для администратора)
export const getTaskById = async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
        // // Проверяем, что пользователь является администратором
        // if (req.user?.role !== 'admin') {
        //     return res.status(403).send('Access denied');
        // }

        const task = await Task.findById(taskId).populate('userId', 'name'); // Опционально: populate для получения информации о пользователе
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
















