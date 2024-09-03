import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`СЕРВЕР РАБОТАЕТ НА ${PORT} ПОРТУ!!!`);
});
