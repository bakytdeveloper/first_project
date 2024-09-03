import mongoose, { Document, Schema } from 'mongoose';

interface Task extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    description: string;
    completed: boolean;
}

const taskSchema = new Schema<Task>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model<Task>('Task', taskSchema);

export default Task;
