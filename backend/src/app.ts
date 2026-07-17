import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from '@/routes/task.routes';
import { errorHandler } from '@/middlewares/errorHandler';

dotenv.config();

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

// Error handler — обязательно последним middleware, после всех роутов
app.use(errorHandler);

export default app;