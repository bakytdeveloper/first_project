import { Request, Response } from 'express';
import Task from '../models/taskModel';

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

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
};

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
