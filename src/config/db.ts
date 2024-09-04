import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('БАЗА ДАННЫХ MongoDB ПОДКЛЮЧЕНА!!!');
    } catch (error) {
        console.error('Ошибка в соединении с базой данных MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
