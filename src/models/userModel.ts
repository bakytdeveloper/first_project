import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
    avatar?: string;
    createdAt: Date;

}

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model<User>('User', userSchema);

export default User;
