import express, { Application } from 'express';
import cors from 'cors';
import taskRoutes from '@/routes/task.routes';
import { errorHandler } from '@/middlewares/errorHandler';

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;